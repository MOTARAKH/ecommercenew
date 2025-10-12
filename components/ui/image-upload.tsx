"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { IKContext, IKUpload } from "imagekitio-react";
import { Button } from "@/components/ui/button";
import { Trash, ImagePlus } from "lucide-react";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;   // returns uploaded image URL
  onRemove: (value: string) => void;   // remove URL from parent list
  value: string[];                     // current URLs (use first item for single image)
  folder?: string;                     // optional ImageKit folder
}

type IKUploadSuccess = { url: string; fileId?: string; filePath?: string } & Record<string, unknown>;

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

  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY ?? "";
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT ?? "";
  const handleIkError = (err: unknown) => console.error("ImageKit upload error:", err);

  // Required: returns { token, expire, signature }
  const authenticator = async () => {
    const res = await fetch("/api/upload/auth");
    if (!res.ok) throw new Error("Failed to fetch ImageKit auth");
    return res.json();
  };

  if (!publicKey || !urlEndpoint) {
    console.error("Missing ImageKit env vars", { publicKey, urlEndpoint });
    return (
      <div className="text-sm text-red-600">
        Missing ImageKit env vars. Set <code>NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY</code> and{" "}
        <code>NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT</code>.
      </div>
    );
  }

  const openPicker = () =>
    (document.getElementById("ik-uploader") as HTMLInputElement | null)?.click();

  return (
    <div>
      {/* Previews */}
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div
            key={url}
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
          >
            <div className="absolute top-2 right-2 z-10">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => onRemove(url)}
                disabled={disabled}
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
            <Image src={url} alt="Image" fill className="object-cover" />
          </div>
        ))}
      </div>

      {/* Hidden IK uploader + trigger button */}
      <IKContext
        publicKey={publicKey}
        urlEndpoint={urlEndpoint}
        authenticator={authenticator}
      >
        <IKUpload
          id="ik-uploader"
          style={{ display: "none" }}
          fileName="upload.jpg"
          useUniqueFileName
          folder={folder}
          validateFile={(file: File) =>
            file.size <= 5 * 1024 * 1024 && file.type.startsWith("image/")
          }
          onSuccess={(res: IKUploadSuccess) => onChange(res.url)}
        />

        <Button
          type="button"
          disabled={disabled}
          variant="secondary"
          onClick={openPicker}
        >
          <ImagePlus className="h-4 w-4 mr-2" />
          Upload
        </Button>
      </IKContext>
    </div>
  );
};

export default ImageUpload;
