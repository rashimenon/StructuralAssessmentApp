import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';
import { supabase } from './supabase';

// Upload photo to Supabase storage and return its public URL
export async function uploadPhoto(uri, folder = 'photos') {
  try {
    // Generate unique filename
    const fileName = `${folder}/${Date.now()}.jpg`;

    // Read file as base64 and convert to binary
    const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
    const arrayBuffer = decode(base64);

    // Upload to Supabase bucket
    const { data, error } = await supabase.storage
      .from('uploads') // 🧠 your bucket name
      .upload(fileName, arrayBuffer, {
        contentType: 'image/jpeg',
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const { data: publicUrlData } = supabase.storage.from('uploads').getPublicUrl(fileName);
    return publicUrlData.publicUrl;

  } catch (error) {
    console.error('❌ Upload failed:', error);
    throw error;
  }
}
