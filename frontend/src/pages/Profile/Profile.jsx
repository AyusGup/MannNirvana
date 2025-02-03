import { useState, useEffect } from "react";
import { useWalletContext } from "../../context/WalletContext";
import defaultAvatar from "../../assets/user.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const BackendURL = import.meta.env.VITE_BACKEND_URL;

// Convert file to Base64
const toBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const ProfilePage = () => {
  const { user, setUser, isConnected } = useWalletContext();
  const [profile, setProfile] = useState({
    name: "Anonymous User",
    avatar: defaultAvatar,
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redirect if user is not logged in
  useEffect(() => {
    if (!user) {
      window.location.href = "/";
    } else {
      setProfile({
        name: user?.name || "Anonymous User",
        avatar: user?.avatar || defaultAvatar,
      });
    }
  }, [isConnected, user]);

  // Handle image upload
  const handleImageChange = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // File size check (100KB limit)
    if (selectedFile.size > 100 * 1024) {
      alert("Please select an image smaller than 100KB.");
      return;
    }

    try {
      const base64 = await toBase64(selectedFile);
      setProfile((prev) => ({ ...prev, avatar: base64 }));
    } catch (error) {
      console.error("Error converting image to base64:", error);
    }
  };

  // Save profile changes
  const saveProfile = async () => {
    try {
      const { name, avatar } = profile;
      const response = await axios.put(`${BackendURL}/user/edit/${user._id}`, {
        name,
        address: user.address,
        avatar,
      });

      setUser(response.data.user);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("user_data");
    window.location.href = "/";
  };

  // Fetch leaderboard data
  useEffect(() => {
    axios
      .get(`${BackendURL}/user/get-top`)
      .then((response) => {
        setUsers(response.data.data);
      })
      .catch((error) => console.error("Error fetching leaderboard:", error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full flex-col items-center justify-center relative p-2">
      {/* Coins Section */}
      <div className="flex justify-end gap-2 bg-white px-4 py-2">
        <p className="text-lg font-semibold text-gray-800">{user?.coins} Mann Coins</p>
        <FontAwesomeIcon icon={faCoins} className="text-yellow-500 text-2xl" />
      </div>
      <div  className="flex justify-around">
      {/* Profile Card */}
      <div className="flex flex-col items-center p-6 bg-white shadow-lg rounded-lg w-96 border border-gray-300">
        <h2 className="text-2xl font-semibold mb-4">Profile</h2>

        {/* Avatar Preview */}
        <img
          src={profile.avatar}
          alt="Avatar Preview"
          className="w-24 h-24 rounded-full border-2 border-gray-300 shadow-sm"
        />

        {/* Upload Avatar */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mt-2 text-sm text-gray-600"
        />

        {/* Name Input */}
        <div className="w-full mt-4">
          <label className="block text-gray-700 font-medium mb-1">Name:</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>

        {/* Save Profile Button */}
        <button
          onClick={saveProfile}
          className="mt-4 px-4 py-2 bg-dark hover:bg-extraDark text-white rounded-md hover:bg-blue-600 transition shadow"
          >
          Save Profile
        </button>

        {/* Logout Button */}
        <div className="mt-4 flex flex-col items-center">
          <p className="text-sm text-gray-600">Want to logout?</p>
          <button
            className="mt-2 px-4 py-2 bg-extraDark text-white rounded-md hover:bg-extraDark transition shadow"
            onClick={logout}
          >
            Log out
          </button>
        </div>
      </div>

      {/* Leaderboard Section */}
      <div className="w-full max-w-xl bg-white shadow-md rounded-lg border border-gray-300">
        <h2 className="text-xl font-semibold text-center m-4">🏆 Leaderboard</h2>

        {loading ? (
          <p className="text-center text-gray-600">Loading leaderboard...</p>
        ) : (
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border border-gray-300 text-left">Rank</th>
                <th className="p-2 border border-gray-300 text-left">Name</th>
                <th className="p-2 border border-gray-300 text-left"><FontAwesomeIcon icon={faCoins} className="text-yellow-500 text-2xl" /> Coins</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={user._id} className="hover:bg-gray-50 h-20">
                    <td className="p-2 border border-gray-300">#{index + 1}</td>
                    <td className="p-2 border border-gray-300">{user.name}</td>
                    <td className="p-2 border border-gray-300">{user.coins}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center p-4 text-gray-500">
                    No leaderboard data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      </div>
    </div>
  );
};

export default ProfilePage;
