import FarmerProfile from '../../components/farmer/FarmerProfile'

const Profile = () => {
  return (
    <div className="page-container max-w-4xl">
      <div className="mb-8">
        <h1 className="section-header">My Profile</h1>
        <p className="text-neutral-600">
          Manage your account information and settings
        </p>
      </div>

      <FarmerProfile />
    </div>
  )
}

export default Profile