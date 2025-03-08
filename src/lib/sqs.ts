import { SQSClient, SendMessageCommand, ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs';

// Validate required environment variables
const requiredEnvVars = [
  'VITE_AWS_REGION',
  'VITE_AWS_ACCESS_KEY_ID', 
  'VITE_AWS_SECRET_ACCESS_KEY',
  'VITE_AWS_SQS_QUEUE_URL'
];

const missingEnvVars = requiredEnvVars.filter(key => !import.meta.env[key]);
if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

// Initialize SQS client with environment variables
const sqs = new SQSClient({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
  }
});

// Queue URL from environment variable
const QUEUE_URL = import.meta.env.VITE_AWS_SQS_QUEUE_URL;

// Send message to SQS queue
export const sendMessage = async (message: any) => {
  try {
    const command = new SendMessageCommand({
      QueueUrl: QUEUE_URL,
      MessageBody: JSON.stringify(message),
      MessageGroupId: message.groupId || 'default', // Required for FIFO queues
      MessageDeduplicationId: message.deduplicationId || Date.now().toString(), // Required for FIFO queues
      MessageAttributes: {
        'MessageType': {
          DataType: 'String',
          StringValue: message.type || 'default'
        }
      }
    });

    const response = await sqs.send(command);
    return response;
  } catch (error) {
    console.error('Error sending message to SQS:', error);
    throw error;
  }
};

// Receive messages from SQS queue
export const receiveMessages = async (maxMessages: number = 10) => {
  try {
    const command = new ReceiveMessageCommand({
      QueueUrl: QUEUE_URL,
      MaxNumberOfMessages: maxMessages,
      WaitTimeSeconds: 20, // Long polling
      MessageAttributeNames: ['All'],
      AttributeNames: ['All']
    });

    const response = await sqs.send(command);
    return response.Messages || [];
  } catch (error) {
    console.error('Error receiving messages from SQS:', error);
    throw error;
  }
};

// Delete message from queue after processing
export const deleteMessage = async (receiptHandle: string) => {
  try {
    const command = new DeleteMessageCommand({
      QueueUrl: QUEUE_URL,
      ReceiptHandle: receiptHandle
    });

    await sqs.send(command);
  } catch (error) {
    console.error('Error deleting message from SQS:', error);
    throw error;
  }
};

// Process messages with a callback function
export const processMessages = async (
  callback: (message: any) => Promise<void>,
  maxMessages: number = 10
) => {
  try {
    const messages = await receiveMessages(maxMessages);
    
    await Promise.all(messages.map(async (message) => {
      try {
        // Process message
        await callback(JSON.parse(message.Body || '{}'));
        // Delete message after successful processing
        await deleteMessage(message.ReceiptHandle!);
      } catch (error) {
        console.error('Error processing message:', error);
        // Don't delete message on error - it will return to queue after visibility timeout
      }
    }));
  } catch (error) {
    console.error('Error in message processing loop:', error);
    throw error;
  }
};

// Example usage:
// Send a message
// await sendMessage({
//   type: 'BOOKING_CREATED',
//   groupId: 'bookings',
//   deduplicationId: 'booking-123',
//   data: {
//     bookingId: '123',
//     userId: '456',
//     service: 'standard_cleaning'
//   }
// });

// Process messages
// await processMessages(async (message) => {
//   switch (message.type) {
//     case 'BOOKING_CREATED':
//       await handleBookingCreated(message.data);
//       break;
//     case 'PAYMENT_COMPLETED':
//       await handlePaymentCompleted(message.data);
//       break;
//     default:
//       console.log('Unknown message type:', message.type);
//   }
// });