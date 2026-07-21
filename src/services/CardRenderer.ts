import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import type { View } from 'react-native';
import { captureRef } from 'react-native-view-shot';

/** Başarı kartı görünümünü (Kupa ekranı) PNG dosyasına yakalar (view-shot, sahne dışı render). */
export async function captureCard(view: View): Promise<string> {
  return captureRef(view, { format: 'png', quality: 1, result: 'tmpfile' });
}

/** Galeriye kaydeder; izin verilmezse false döner (çağıran taraf kullanıcıyı bilgilendirir). */
export async function saveCardToGallery(uri: string): Promise<boolean> {
  const { granted } = await MediaLibrary.requestPermissionsAsync(true);
  if (!granted) return false;
  await MediaLibrary.Asset.create(uri);
  return true;
}

/** Native paylaşım sayfasını açar; cihazda paylaşım mevcut değilse false döner. */
export async function shareCard(uri: string): Promise<boolean> {
  if (!(await Sharing.isAvailableAsync())) return false;
  await Sharing.shareAsync(uri);
  return true;
}
