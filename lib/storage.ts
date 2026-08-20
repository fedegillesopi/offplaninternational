import { createClient } from "@/lib/supabase/client";

const DEFAULT_BUCKET = "developer-images";

export async function uploadImage(
  file: File,
  userId: string,
  folder: string,
  bucket: string = DEFAULT_BUCKET,
): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${userId}/${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: false });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
