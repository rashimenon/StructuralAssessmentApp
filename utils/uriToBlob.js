export async function uriToBlob(uri) {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error('uriToBlob error:', error);
    throw error;
  }
}
