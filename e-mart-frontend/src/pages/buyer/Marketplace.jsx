import MarketplaceBrowse from '../../components/buyer/MarketplaceBrowse'

const Marketplace = () => {
  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="section-header">Marketplace</h1>
        <p className="text-neutral-600">
          Browse and buy fresh rice directly from local farmers
        </p>
      </div>

      <MarketplaceBrowse />
    </div>
  )
}

export default Marketplace