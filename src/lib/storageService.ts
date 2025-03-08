import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

class StorageService {
  private static instance: StorageService;
  private readonly BUCKET_NAME = 'uploads';

  private constructor() {}

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  public async uploadProfilePhoto(file: File, userId: string): Promise<string> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/profile/${uuidv4()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(`profiles/${fileName}`, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(`profiles/${fileName}`);

      // Update user profile
      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);

      if (updateError) throw updateError;

      return publicUrl;
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      throw error;
    }
  }

  public async uploadBookingPhotos(files: File[], bookingId: string): Promise<string[]> {
    try {
      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${bookingId}/${uuidv4()}.${fileExt}`;
        
        const { data, error } = await supabase.storage
          .from(this.BUCKET_NAME)
          .upload(`bookings/${fileName}`, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) throw error;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from(this.BUCKET_NAME)
          .getPublicUrl(`bookings/${fileName}`);

        return publicUrl;
      });

      const urls = await Promise.all(uploadPromises);
      return urls;
    } catch (error) {
      console.error('Error uploading booking photos:', error);
      throw error;
    }
  }

  public async deleteFile(url: string): Promise<void> {
    try {
      const path = url.split('/').slice(-2).join('/');
      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([path]);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }
}

export const storageService = StorageService.getInstance();