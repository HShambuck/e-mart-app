import { useState, useRef } from 'react'
import { IoCloudUpload, IoClose, IoImage } from 'react-icons/io5'
import { formatFileSize } from '../../utils/formatters'
import { isValidImage } from '../../utils/validators'
import toast from 'react-hot-toast'

const ImageUpload = ({ 
  value,
  onChange,
  onRemove,
  label = 'Upload Image',
  maxSize = 5 * 1024 * 1024, // 5MB
  className = '' 
}) => {
  const [preview, setPreview] = useState(value || null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileSelect = (file) => {
    if (!file) return

    const validation = isValidImage(file)
    
    if (!validation.isValid) {
      const errorMessage = validation.errors.type || validation.errors.size
      toast.error(errorMessage)
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
    }
    reader.readAsDataURL(file)

    // Call onChange callback
    if (onChange) {
      onChange(file)
    }
  }

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0]
    handleFileSelect(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files?.[0]
    handleFileSelect(file)
  }

  const handleRemove = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    if (onRemove) {
      onRemove()
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          {label}
        </label>
      )}

      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg"
          />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
          >
            <IoClose size={20} />
          </button>
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-primary-500 bg-primary-50'
              : 'border-neutral-300 hover:border-primary-400 hover:bg-neutral-50'
          }`}
        >
          <IoCloudUpload className="mx-auto text-neutral-400 mb-4" size={48} />
          <p className="text-sm text-neutral-600 mb-1">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-neutral-500">
            PNG, JPG, WebP up to {formatFileSize(maxSize)}
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  )
}

export default ImageUpload