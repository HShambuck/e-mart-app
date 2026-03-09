import { IoSearch, IoClose } from 'react-icons/io5'
import Input from './Input'

const SearchBar = ({ 
  value,
  onChange,
  onClear,
  placeholder = 'Search...',
  className = '' 
}) => {
  const handleClear = () => {
    if (onClear) {
      onClear()
    } else if (onChange) {
      onChange({ target: { value: '' } })
    }
  }

  return (
    <div className={`relative ${className}`}>
      <Input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        leftIcon={<IoSearch size={20} />}
        rightIcon={
          value && (
            <button
              onClick={handleClear}
              className="text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <IoClose size={20} />
            </button>
          )
        }
      />
    </div>
  )
}

export default SearchBar