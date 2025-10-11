"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import {Image , ImageKitProvider} from "@imagekit/next";

interface ImageUploadProps {
    disabled?: boolean;
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
    value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    disabled,
    onChange,
    onRemove,
    value
}) => {
      const [isMounted, setIsMounted] = useState(false)
    
        useEffect(() => {
            setIsMounted(true);
        }, []);

        const onUpload = (result: any) => {
            onChange(result.info.secure_url);
        }
    
        if (!isMounted) {
            return null;
        }

    return (
        <div>
            <div className="mb-4 flex items-center gap-4">
                {value.map((url) => (
                    <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
                        <div className="z-10 absolute top-2 right-2">
                            <Button type="button" onClick={() => onRemove(url)} variant="destructive" size="icon">
                                <Trash className="w-4 h-4" />
                            </Button>
                        </div>
                            <Image 
                                fill
                                className="object-cover"
                                alt="image"
                                src={url}
                            />
                    </div>
                ))}
            </div>
              <CldUploadwidget onUpload={onUpload} uploadPreset="npqshzol">
                
              </CldUploadwidget>
        </div>
    )
}

export default ImageUpload;