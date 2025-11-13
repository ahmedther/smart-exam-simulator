import profilePic from "../../assets/profile.jpg";

export default function UserProfileCircle() {
  return (
    <div className=" ml-auto lg:ml-10 flex items-center gap-1">
      <div className=" bg-on-tertiary-container  w-13.5 h-13.5 rounded-full">
        <div className="mt-1 ml-1 bg-secondary w-11.5 h-11.5 rounded-full">
          <img
            src={profilePic}
            alt="profile"
            className="w-11.5 h-11.5 rounded-full"
          />
        </div>
      </div>
      <h1 className="text-on-tertiary-container font-bold">
        {import.meta.env.VITE_USER_NAME}
      </h1>
    </div>
  );
}
