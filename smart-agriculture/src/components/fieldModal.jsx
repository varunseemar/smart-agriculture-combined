import React,{ useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { BACKEND_URL } from "../utils/constants";

const fieldModal =({ isOpen, onClose, onSubmit }) =>{
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    cropType: "",
    area: "",
  });

  const handleFormSubmit = async(e) =>{
    e.preventDefault();
    const{ name, location, cropType, area } = formData;
    if(!name || !location || !cropType || !area){
      toast.error("Please fill all fields");
      return;
    }
    try{
      const ownerID = localStorage.getItem('email');
      const response = await axios.post(`${BACKEND_URL}/api/fields/addField`, {
        ...formData,
        owner: ownerID,
      });
      toast.success(response.data.message);
      setFormData({ name: "", location: "", cropType: "", area: "" });
      onClose();
    } 
    catch(error){
      toast.error("Failed to add field");
      console.error(error);
    }
  };
  
  const handleCancel = () => {
    setFormData({ name: "", location: "", cropType: "", area: "" });
    onClose();
  };

  if(!isOpen){
    return null;
  }

  return(
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold mb-4">Add New Field</h3>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Field Name</label>
            <input type="text" placeholder={"eg :- Field 1"} className="border rounded-md w-full p-2" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}/>
          </div>
          <div>
            <label className="block text-sm font-medium">
              Location(Lat/Lng)
            </label>
            <input type="text" placeholder={"19.609477,31.868430"} className="border rounded-md w-full p-2" value={formData.location} onChange={(e) =>setFormData({ ...formData, location: e.target.value })}/>
          </div>
          <div>
            <label className="block text-sm font-medium">Crop Type</label>
            <input type="text" placeholder={"eg :- Wheat"} className="border rounded-md w-full p-2" value={formData.cropType} onChange={(e) =>setFormData({ ...formData, cropType: e.target.value })}/>
          </div>
          <div>
            <label className="block text-sm font-medium">Area Size</label>
            <input type="text" placeholder={"350 Acres"} className="border rounded-md w-full p-2" value={formData.area} onChange={(e) =>setFormData({ ...formData, area: e.target.value })}/>
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" className="px-4 py-2 bg-gray-200 rounded-md" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default fieldModal;
