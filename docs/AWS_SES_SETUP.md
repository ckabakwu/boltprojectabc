# Amazon SES Setup Guide for HomeMaidy

## 1. Initial AWS Account Setup

### AWS Account Creation
1. Go to [AWS Console](https://aws.amazon.com/console/)
2. Click "Create an AWS Account"
3. Follow the registration process
4. Enable MFA for root account security

### Required IAM Permissions
Create an IAM user with the following policies:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ses:SendEmail",
                "ses:SendRawEmail",
                "ses:GetSendQuota",
                "ses:GetSendStatistics",
                "ses:VerifyEmailIdentity",
                "ses:VerifyDomainIdentity",
                "ses:GetIdentityVerificationAttributes"
            ],
            "Resource": "*"
        }
    ]
}
```

## 2. SES Configuration

### Domain Verification
1. Open AWS Console > SES > Domains
2. Click "Verify a New Domain"
3. Enter your domain: `homemaidy.com`
4. Check "Generate DKIM Settings"
5. Add provided DNS records to your domain:
   ```
   Type  | Name                   | Value
   TXT   | _amazonses.homemaidy.com | "verification-token"
   ```

### DKIM Setup
Add the following CNAME records:
```
selector1._domainkey.homemaidy.com -> dkim.amazonses.com
selector2._domainkey.homemaidy.com -> dkim.amazonses.com
selector3._domainkey.homemaidy.com -> dkim.amazonses.com
```

### SPF Record
Add to your domain's DNS:
```
TXT @ "v=spf1 include:amazonses.com ~all"
```

## 3. Production Access

### Moving Out of Sandbox
1. Open SES Console > Sending Statistics
2. Click "Request Production Access"
3. Fill out the form:
   - Use case: Transactional emails
   - Mail volume: Estimated monthly volume
   - Content compliance
   - Security measures
4. Submit and wait for approval (typically 24-48 hours)

### Sending Limits
Default limits after production access:
- Daily sending quota: 50,000 emails/24 hours
- Maximum send rate: 14 emails/second
- Request limit increase if needed

## 4. API Credentials

### Create SMTP Credentials
1. Go to SES Console > SMTP Settings
2. Click "Create My SMTP Credentials"
3. Save credentials securely:
   ```
   SMTP Host: email-smtp.{region}.amazonaws.com
   Port: 587 (TLS) or 465 (SSL)
   Username: YOUR_SMTP_USERNAME
   Password: YOUR_SMTP_PASSWORD
   ```

### API Keys
1. Create IAM user for API access
2. Generate access keys
3. Add to environment variables:
   ```
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=your_region
   AWS_SES_ENDPOINT=email.{region}.amazonaws.com
   ```

## 5. Testing Configuration

### Test Email Setup
```bash
# Using AWS CLI
aws ses send-email \
    --from "noreply@homemaidy.com" \
    --destination "ToAddresses=test@example.com" \
    --message "Subject={Data=Test Email,Charset=UTF-8},Body={Text={Data=This is a test email,Charset=UTF-8}}"
```

### Monitoring Setup
1. Enable CloudWatch metrics
2. Set up alarms for:
   - Bounce rate > 5%
   - Complaint rate > 0.1%
   - Failed delivery attempts

## 6. Best Practices

### Email Authentication
- Implement DMARC policy:
  ```
  _dmarc.homemaidy.com TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@homemaidy.com"
  ```
- Monitor authentication reports

### Deliverability Tips
1. Maintain clean recipient lists
2. Implement proper unsubscribe handling
3. Monitor bounce and complaint rates
4. Use consistent "From" addresses
5. Implement proper email templates

### Security Measures
1. Rotate SMTP credentials regularly
2. Use TLS for all SMTP connections
3. Implement IP allowlisting
4. Monitor for unusual sending patterns

## 7. Troubleshooting

### Common Issues
1. Verification pending
   - Check DNS propagation
   - Verify record format
2. Sending quota exceeded
   - Monitor CloudWatch metrics
   - Request quota increase
3. Authentication failures
   - Verify SMTP credentials
   - Check TLS settings

### Support Resources
- AWS SES Documentation
- AWS Support Center
- CloudWatch Logs
- SES Sending Statistics

## 8. Compliance

### Requirements
1. CAN-SPAM Act compliance
   - Valid physical address
   - Clear unsubscribe option
   - Honest subject lines
2. GDPR compliance (if applicable)
   - Consent management
   - Data retention policies
3. Email content guidelines
   - No misleading headers
   - Clear identification

### Monitoring
1. Set up CloudWatch metrics
2. Configure SNS notifications
3. Implement logging for:
   - Delivery
   - Bounces
   - Complaints
   - Opens/clicks (optional)

## 9. Integration

### Environment Variables
Add to `.env`:
```
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region
AWS_SES_ENDPOINT=email.{region}.amazonaws.com
AWS_SES_FROM_EMAIL=noreply@homemaidy.com
```

### Health Checks
Monitor:
1. SMTP connectivity
2. API access
3. Quota usage
4. Bounce rates
5. Complaint rates

## 10. Production Checklist

- [ ] Domain verified
- [ ] DKIM configured
- [ ] SPF record added
- [ ] DMARC policy set
- [ ] Production access granted
- [ ] SMTP credentials secured
- [ ] Environment variables set
- [ ] Monitoring configured
- [ ] Compliance requirements met
- [ ] Testing completed