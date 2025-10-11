"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash, ImagePlus } from "lucide-react";
import Image from "next/image";
import { IKContext, IKUpload } from "imagekitio-react";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
  folder?: string;
}

type IKUploadSuccess = { url: string; fileId?: string; filePath?: string };

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
  folder = "/uploads",
}) => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);
  if (!isMounted) return null;

  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!;
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!;

  // 🔐 دالة المصادقة المطلوبة من المكتبة
  const authenticator = async () => {
    const res = await fetch("/api/upload/auth");
    if (!res.ok) throw new Error("Failed to fetch ImageKit auth");
    return res.json(); // { token, expire, signature }
  };

  if (!publicKey || !urlEndpoint) {
    console.error("Missing ImageKit env vars", { publicKey, urlEndpoint });
    return <div className="text-sm text-red-600">Missing ImageKit env vars.</div>;
  }

  return (
    <div>
      {/* previews */}
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
            <div className="absolute top-2 right-2 z-10">
              <Button type="button" onClick={() => onRemove(url)} variant="destructive" size="icon">
                <Trash className="w-4 h-4" />
              </Button>
            </div>
            <Image fill className="object-cover" alt="Image" src={url} />
          </div>
        ))}
      </div>

      <IKContext publicKey={publicKey} urlEndpoint={urlEndpoint} authenticator={authenticator}>
        <IKUpload
          id="ik-uploader"
          style={{ display: "none" }}
          fileName="upload.jpg"
          useUniqueFileName
          folder={folder}
          validateFile={(file: File) => file.size <= 5 * 1024 * 1024 && file.type.startsWith("image/")}
          onError={(err: unknown) => console.error(err)}
          onSuccess={(res: IKUploadSuccess) => onChange(res.url)}
        />

        <Button
          type="button"
          disabled={disabled}
          variant="secondary"
          onClick={() => document.getElementById("ik-uploader")?.click()}
        >
          <ImagePlus className="h-4 w-4 mr-2" />
          Upload
        </Button>
      </IKContext>
    </div>
  );
};

export default ImageUpload;
