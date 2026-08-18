
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSiteData } from '../src/hooks/useSiteData';

interface EditableImageProps {
    storageKey: string;
    defaultSrc: string;
    alt: string;
    className?: string;
    wrapperClassName?: string;
    onLoad?: () => void;
    clickToUpload?: boolean;
}

const EditableImage: React.FC<EditableImageProps> = ({ 
    storageKey, 
    defaultSrc, 
    alt, 
    className, 
    wrapperClassName,
    onLoad,
    clickToUpload = false
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { isAdmin } = useAuth();
    const [src, setSrc] = useSiteData(storageKey, defaultSrc);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Compress image before saving to localStorage
            try {
                const compressedDataUrl = await compressImage(file, 1200, 1200, 0.7);
                try {
                    await setSrc(compressedDataUrl);
                    window.dispatchEvent(new CustomEvent('image-updated'));
                } catch (error) {
                    console.error("Storage failed", error);
                    alert("Failed to save image. Try a smaller image.");
                }
            } catch (error) {
                console.error("Image compression failed", error);
                alert("Failed to process image.");
            }
        }
    };

    const compressImage = (file: File, maxWidth: number, maxHeight: number, quality: number): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    let width = img.width;
                    let height = img.height;
                    
                    if (width > maxWidth || height > maxHeight) {
                        if (width / height > maxWidth / maxHeight) {
                            height = Math.round(height * maxWidth / width);
                            width = maxWidth;
                        } else {
                            width = Math.round(width * maxHeight / height);
                            height = maxHeight;
                        }
                    }
                    
                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.drawImage(img, 0, 0, width, height);
                        // Default to jpeg for compression, if it's png it might lose transparency but it's acceptable for saving storage
                        resolve(canvas.toDataURL('image/jpeg', quality));
                    } else {
                        reject(new Error('Canvas context not available'));
                    }
                };
                img.onerror = (error) => reject(new Error('Failed to load image for compression'));
                img.src = event.target?.result as string;
            };
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };

    const triggerUpload = (e: React.MouseEvent) => {
        if (!isAdmin) return;
        e.stopPropagation();
        fileInputRef.current?.click();
    };

    return (
        <div 
            className={`relative ${isAdmin ? 'group/edit' : ''} ${wrapperClassName || ''} ${clickToUpload && isAdmin ? 'cursor-pointer' : ''}`}
            onClick={clickToUpload && isAdmin ? triggerUpload : undefined}
        >
            <img 
                src={src} 
                alt={alt} 
                className={className}
                onLoad={onLoad} 
            />
            
            {isAdmin && (
                <div 
                    onClick={!clickToUpload ? triggerUpload : (e) => e.stopPropagation()}
                    className={`absolute top-2 right-2 p-2 bg-black/60 hover:bg-black/80 rounded-full text-white cursor-pointer transition-opacity z-30 backdrop-blur-sm shadow-md ${clickToUpload ? 'opacity-40 group-hover/edit:opacity-100' : 'opacity-0 group-hover/edit:opacity-100'}`}
                    title="Change Image"
                    role="button"
                    aria-label="Change image"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                    </svg>
                </div>
            )}
            
            {clickToUpload && isAdmin && (
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/edit:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="bg-black/40 text-white text-[10px] px-2 py-1 rounded-md backdrop-blur-sm">Click to change</span>
                </div>
            )}

            {isAdmin && (
                <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                />
            )}
        </div>
    );
};

export default EditableImage;
