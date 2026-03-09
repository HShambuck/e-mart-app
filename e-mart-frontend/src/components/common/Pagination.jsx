import { IoChevronBack, IoChevronForward } from 'react-icons/io5'
import Button from './Button'

const Pagination = ({ 
  currentPage,
  totalPages,
  onPageChange,
  showPageNumbers = true,
  maxPageNumbers = 5,
  className = '' 
}) => {
  const getPageNumbers = () => {
    const pages = []
    const halfMax = Math.floor(maxPageNumbers / 2)
    
    let startPage = Math.max(1, currentPage - halfMax)
    let endPage = Math.min(totalPages, currentPage + halfMax)
    
    // Adjust if we're near the start or end
    if (currentPage <= halfMax) {
      endPage = Math.min(totalPages, maxPageNumbers)
    }
    if (currentPage + halfMax >= totalPages) {
      startPage = Math.max(1, totalPages - maxPageNumbers + 1)
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    
    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {/* Previous Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        leftIcon={<IoChevronBack />}
      >
        Previous
      </Button>

      {/* Page Numbers */}
      {showPageNumbers && (
        <div className="flex items-center gap-1">
          {pageNumbers[0] > 1 && (
            <>
              <PageButton page={1} currentPage={currentPage} onClick={onPageChange} />
              {pageNumbers[0] > 2 && <span className="px-2 text-neutral-400">...</span>}
            </>
          )}
          
          {pageNumbers.map((page) => (
            <PageButton
              key={page}
              page={page}
              currentPage={currentPage}
              onClick={onPageChange}
            />
          ))}
          
          {pageNumbers[pageNumbers.length - 1] < totalPages && (
            <>
              {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                <span className="px-2 text-neutral-400">...</span>
              )}
              <PageButton page={totalPages} currentPage={currentPage} onClick={onPageChange} />
            </>
          )}
        </div>
      )}

      {/* Next Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        rightIcon={<IoChevronForward />}
      >
        Next
      </Button>
    </div>
  )
}

const PageButton = ({ page, currentPage, onClick }) => {
  const isActive = page === currentPage
  
  return (
    <button
      onClick={() => onClick(page)}
      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
        isActive
          ? 'bg-primary-600 text-white'
          : 'text-neutral-600 hover:bg-neutral-100'
      }`}
    >
      {page}
    </button>
  )
}

export default Pagination