import React,{ useEffect, useState } from 'react';
import axios from 'axios';
import moment from "moment";
import toast from 'react-hot-toast';
import{ Trash } from "lucide-react";
import{ useNavigate } from 'react-router-dom';
import{ Card, CardContent, CardHeader, CardTitle } from "./card";
import{ BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line} from "recharts";
import FieldModal from "../components/fieldModal";
import{ Leaf, MapPin, Droplets, Sun } from "lucide-react";
import logo from '../images/logo.png'
import{ BACKEND_URL } from "../utils/constants";

const Dashboard =() =>{
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fields, setFields] = useState([]);
  const navigate = useNavigate()
  const [yieldData, setYieldData] = useState([]);
  const [healthData, setHealthData] = useState([]);
  const [avgYield, setAvgYield] = useState(0);
  const [yieldChange, setYieldChange] = useState(0);
  const [healthRating, setHealthRating] = useState("Good");
  const [reload, setReload] = useState(0);
  const ownerId = localStorage.getItem("email");

  useEffect(() =>{
    const fetchFields = async() =>{
      try{
        const response = await axios.get(`${BACKEND_URL}/api/fields/getFields/${ownerId}`);
        const fields = response.data;
        setFields(fields);
        processYieldData(fields);
        processHealthData(fields);
        calculateCards(fields);
      } 
      catch(error){
        console.error("Error fetching fields:", error);
        toast.error("Failed to fetch fields.");
      }
    };

    fetchFields();
  }, [ownerId,fields]);

  const processYieldData =(fields) =>{
    const lastSixMonths = Array.from({ length: 6 },(_, i) =>
      moment().subtract(i, "months").format("MMM")
    ).reverse();

    const yieldDataMap = lastSixMonths.reduce((acc, month) =>{
      acc[month] ={ month, totalYield: 0, count: 0 };
      return acc;
    },{});

    fields.forEach((field) =>{
    (field.yieldHistory || []).forEach(({ month, yield: yieldValue }) =>{
        if(yieldDataMap[month]){
          yieldDataMap[month].totalYield += yieldValue;
          yieldDataMap[month].count++;
        }
      });
    });

    const processedYieldData = lastSixMonths.map((month) =>({
      month,
      yield: yieldDataMap[month].count
        ?(yieldDataMap[month].totalYield / yieldDataMap[month].count).toFixed(2)
        : 0,
    }));

    setYieldData(processedYieldData);
  };

  const handleDeleteField = async(fieldId) =>{
    try{
      await axios.delete(`${BACKEND_URL}/api/fields/deleteField/${fieldId}`,{
        data:{ owner: ownerId },
      });
      toast.success("Field deleted successfully");
      setFields(fields.filter((field) => field._id !== fieldId));
      setReload(reload + 1);
    } 
    catch(error){
      console.error("Error deleting field:", error);
      toast.error("Failed to delete field.");
    }
  };

  const processHealthData =(fields) =>{
    const lastSevenDays = Array.from({ length: 7 },(_, i) =>
      moment().subtract(i, "days").format("ddd")
    ).reverse();

    const healthDataMap = lastSevenDays.reduce((acc, day) =>{
      acc[day] ={ day, totalValue: 0, count: 0 };
      return acc;
    },{});

    fields.forEach((field) =>{
    (field.cropHealth || []).forEach(({ day, value }) =>{
        if(healthDataMap[day]){
          healthDataMap[day].totalValue += value;
          healthDataMap[day].count++;
        }
      });
    });

    const processedHealthData = lastSevenDays.map((day) =>({
      day,
      value: healthDataMap[day].count
        ?(healthDataMap[day].totalValue / healthDataMap[day].count).toFixed(2)
        : 0,
    }));

    setHealthData(processedHealthData);
  };

  const calculateCards =(fields) =>{
  const allYields = fields.flatMap((field) =>
    field.yieldHistory.map((y) => y.yield)
  );
  const totalYield = allYields.reduce((acc, val) => acc + val, 0);
  setAvgYield((totalYield / allYields.length).toFixed(2));

  const lastThreeMonths = moment().subtract(3, "months").format("MMM");
  const prevThreeMonths = moment().subtract(6, "months").format("MMM");

  const lastPeriodYield = fields.flatMap((field) =>
    field.yieldHistory.filter((y) => y.month >= lastThreeMonths).map((y) => y.yield)
  );
  const prevPeriodYield = fields.flatMap((field) =>
    field.yieldHistory.filter((y) => y.month < lastThreeMonths && y.month >= prevThreeMonths).map((y) => y.yield)
  );

  const lastMean = lastPeriodYield.reduce((acc, val) => acc + val, 0) / lastPeriodYield.length || 0;
  const prevMean = prevPeriodYield.reduce((acc, val) => acc + val, 0) / prevPeriodYield.length || 0;

  setYieldChange(((lastMean - prevMean) / prevMean * 100).toFixed(2));

  const allHealthValues = fields.flatMap((field) =>
    field.cropHealth.map((h) => h.value)
  );
  const healthMean = allHealthValues.reduce((acc, val) => acc + val, 0) / allHealthValues.length;
  setHealthRating(healthMean >= 70 ? "Good" : "Medium");
};

  const handleAddField =(newField) =>{
    setReload(reload + 1);
    setFields([...fields, newField]);
  };
  const handleLogout =() =>{
    localStorage.removeItem('email')
    localStorage.removeItem('name')
    localStorage.removeItem('token')
    toast.success('Successfully Logged Out');
    navigate('/login');
  }

  const closeModal =() => setIsModalOpen(false);
  return(

    <div className="min-h-screen bg-background">
      <nav className="border-b bg-white/50 backdrop-blur-sm fixed w-full z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src={logo} className="h-16 w-16" />
            <span className="text-xl font-bold text-primary">Smart Agriculture</span>
          </div>
          <div className="flex items-center space-x-4">
          <button
              className="px-4 py-2 bg-black/10 border rounded-md"
              onClick={() => setIsModalOpen(true)}
            >
              Add Field
            </button>
            <button className="px-4 py-2 bg-primary text-white rounded-md" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 pt-28 pb-10">
      <FieldModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddField}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="gradient-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2" style={{flexDirection:"row"}}>
              <CardTitle className="text-sm font-medium">Total Fields</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{fields.length}</div>
            </CardContent>
          </Card>

          <Card className="gradient-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2" style={{flexDirection:"row"}}>
              <CardTitle className="text-sm font-medium">Average Yield</CardTitle>
              <Leaf className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {fields.length === 0 ? <div className="text-2xl font-bold">0%</div> : <div className="text-2xl font-bold">{avgYield}%</div>}
              {fields.length === 0 ? <p className="text-xs text-muted-foreground">0% from last season</p> : <p className="text-xs text-muted-foreground">{yieldChange}% from last season</p>}
            </CardContent>
          </Card>

          <Card className="gradient-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2" style={{flexDirection:"row"}}>
              <CardTitle className="text-sm font-medium">Soil Moisture</CardTitle>
              <Droplets className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            {fields.length === 0 ? <div className="text-2xl font-bold">0%</div> : <div className="text-2xl font-bold">75%</div>}
              <p className="text-xs text-muted-foreground">Optimal range</p>           
              </CardContent>
          </Card>

          <Card className="gradient-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2" style={{flexDirection:"row"}}>
              <CardTitle className="text-sm font-medium">Light Exposure</CardTitle>
              <Sun className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {fields.length === 0 ? <div className="text-2xl font-bold">0</div> : <div className="text-2xl font-bold">8.5h</div>}
              <p className="text-xs text-muted-foreground">Daily average</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
        <CardHeader>
          <CardTitle>Yield Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yieldData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="yield" fill="#2F5233" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Crop Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={healthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#2F5233" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
        </div>
  <Card className="mb-8">
  <CardHeader>
    <CardTitle>Field Management</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="overflow-x-auto whitespace-nowrap space-x-4 flex">
  {fields.map((field, index) =>(
                <Card key={index} className="gradient-card min-w-[250px] inline-block">
                  <CardHeader className="flex items-center justify-between !flex-row">
                    <CardTitle className="text-lg">{field.fieldName}</CardTitle>
                    <Trash
                      className="h-5 w-5 cursor-pointer text-red-500"
                      onClick={() => handleDeleteField(field._id)}
                    />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Crop Type:</span>
                        <span className="text-sm font-medium">{field.cropType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Area:</span>
                        <span className="text-sm font-medium">{field.areaSize} acres</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Location:</span>
                        <span className="text-sm font-medium">{field.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Health:</span>
                        <span className="text-sm font-medium text-green-600">Good</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>AI Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-primary/5 rounded-lg">
                <h4 className="font-medium mb-2">Crop Health Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  Based on recent data, your crops are showing optimal growth patterns. 
                  Consider increasing irrigation by 5% next week due to forecasted higher temperatures.
                </p>
              </div>
              <div className="p-4 bg-primary/5 rounded-lg">
                <h4 className="font-medium mb-2">Soil Composition</h4>
                <p className="text-sm text-muted-foreground">
                  Nitrogen levels are within ideal range. Phosphorus supplementation may be beneficial 
                  for the upcoming growth phase.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;