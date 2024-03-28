import React, { useEffect, useState } from 'react'
import "../styles/Dashboard.css";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import Image from "../assets/image.png";
import Logo from "../assets/logo.png";
import GoogleSvg from "../assets/icons8-google.svg";
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";
import "../styles/Login.css";
import "../styles/popup.css";


const Dashboard = () => {
  const [token, setToken] = useState(JSON.parse(localStorage.getItem("auth")) || "");
  const [data, setData] = useState({});
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();
  const [reward, setReward] = useState('');
  const [numCustomers, setNumCustomers] = useState(1);
  const [customerData, setCustomerData] = useState([]);

  const fetchUserData = async () => {

    let axiosConfig = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    try {
      const response = await axios.get("https://customerloyaltybackend.onrender.com/api/v1/businessDashboard", axiosConfig);
      setData({
        msg: response.data.msg, businessId: response.data.businessId, rewardName: response.data.rewardName,
        rewardDollar: response.data.rewardDollar, redeemLimit: response.data.redeemLimit, businessName: response.data.businessName
      });
      setUserData(response.data.businessPoints[0]);
      // console.log(response.data.businessPoints[0]);
    } catch (error) {
      toast.error(error.message);
    }


  }

  const fetchPointsData = async () => {

    let axiosConfig = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    try {
      const response = await axios.get("https://customerloyaltybackend.onrender.com/api/v1/getBusinessPointsDetails", axiosConfig);
      setData({
        msg: response.data.msg, businessId: response.data.businessId, rewardName: response.data.rewardName,
        rewardDollar: response.data.rewardDollar, redeemLimit: response.data.redeemLimit
      });
      setUserData(response.data.userData);
      console.log(response.data.businessData);
    } catch (error) {
      toast.error(error.message);
    }


  }

  const calcReward = async (e) => {

    let amount = parseFloat(e.target.value);
    console.log(amount);

    const newReward = isNaN(amount) ? '' : (amount * userData.rewardDollar).toString();
    setReward(newReward);
  };

  const handleChange = (e) => {
    setNumCustomers(parseInt(e.target.value));
  };

  const handleCustomerDataChange = (index, field, value) => {
    const updatedCustomerData = [...customerData];
    updatedCustomerData[index][field] = value;
    setCustomerData(updatedCustomerData);
  };

  useEffect(() => {
    fetchUserData();

    if (token === "") {
      navigate("/businessLogin");
      toast.warn("Please login first to access dashboard");
    }
  }, [token]);

  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const divStyle = {
    backgroundColor: '#f4f4f4',
    borderRadius: '10px',
    padding: '20px',

  };

  const updatePoints = async (e) => {
    e.preventDefault();
    let rewardName = e.target.rewardName.value;
    let rewardDollar = e.target.rewardDollar.value;
    let redeemLimit = e.target.redeemLimit.value;
    let dollarPer100 = e.target.dollarPer100.value;
    // console.log("business Id: " + data.businessId);
    if (rewardName.length > 0) {
      const formData = {
        businessId: data.businessId,
        rewardName,
        rewardDollar,
        redeemLimit,
        dollarPer100
      };

      if (!userData) {
        try {
          const response = await axios.post(
            "https://customerloyaltybackend.onrender.com/api/v1/addBusinessPoints",
            formData
          );
          fetchUserData();
          toast.success("Points Details Defined successfully");

        } catch (err) {
          console.log(err);
          toast.error(err.message);
        }
      } else {
        try {
          const response = await axios.put(
            "https://customerloyaltybackend.onrender.com/api/v1/updateBusinessPointsDetails/",
            formData
          );
          fetchUserData();
          toast.success("Points Details updated successfully");

        } catch (err) {
          console.log(err);
          toast.error(err.message);
        }
      }

    } else {
      toast.error("Please fill all inputs");
    }
  };
  const updateCustomerPoints = async (e) => {
    e.preventDefault();
    let reward = e.target.reward.value;
    let customerId = e.target.customerId.value;
    let amountPurchased = e.target.amountPurchased.value;

    if (customerId.length > 0 && reward.length > 0 && amountPurchased.length > 0) {
      const formData = {
        businessName: data.businessName,
        customerId: customerId,
        businessId: data.businessId,
        reward: reward,
        redeemLimit: userData.redeemLimit,
        amountPurchased: amountPurchased,
        rewardDollar: userData.rewardDollar,
        dollarPer100: userData.dollarPer100

      };


      try {
        const response = await axios.post(
          "https://customerloyaltybackend.onrender.com/api/v1/addPoints",
          formData
        );
        //localStorage.setItem('auth', JSON.stringify(response.data.token));
        toast.success("Points Details updated successfully");
        togglePopup()
      } catch (err) {
        console.log(err);
        toast.error(err.message);
      }
    } else {
      toast.error("Please fill all inputs");
    }
  };
  return (
    <div className="login-main">
      <div className="login-left">
        <img src={Image} alt="" />
      </div>
      <div className="login-right">
        <div className="login-right-container">
          <div className="login-logo">
            <img src={Logo} alt="" />
          </div>
          <div className="login-center">
            <h1>Business Dashboard</h1>
            <p>Hi {data.msg}!, your Business Id: {data.businessId}</p>

            <div style={divStyle}>

              {userData !== undefined && (
                <div>
                 
                  <button onClick={togglePopup} style={{ borderRadius: '20px', backgroundColor: 'blue', color: 'white', padding: '10px 20px', border: 'none', cursor: 'pointer' }}>Enter Customer Points</button>

                  <p style={{ textAlign: 'left' }}>Reward Name: {userData.rewardName}  </p>
                  <p style={{ textAlign: 'left' }}>Rewards/Dollar: {userData.rewardDollar} </p>
                  <p style={{ textAlign: 'left' }}>Dollar/100: {userData.dollarPer100} </p>
                  <p style={{ textAlign: 'left' }}>Redeem Limit: {userData.redeemLimit} </p>
                </div>
              )}


              <form onSubmit={updatePoints}>
                <p>Update Business Points Details</p>
                <p style={{ textAlign: 'right' }}><input type="text" placeholder="Enter Reward Name" name="rewardName" /></p>
                <p style={{ textAlign: 'right' }}><input type="text" placeholder="Enter Reward Dollar" name="rewardDollar" /></p>
                <p style={{ textAlign: 'right' }}><input type="text" placeholder="Enter Dollar/100 points" name="dollarPer100" /></p>
                <p style={{ textAlign: 'right' }}><input type="text" placeholder="Enter Redeem Limit" name="redeemLimit" /></p>
                <p style={{ textAlign: 'right' }}> <button style={{ borderRadius: '20px', backgroundColor: 'blue', color: 'white', padding: '10px 20px', border: 'none', cursor: 'pointer' }} type='submit'>Update Point Details</button> </p>
              </form>

               {showPopup && (
                <div className="popup">
                  <div className="popup-inner">
                    <h2>Customer Points </h2>
                    <div className="input-group">
                      <form onSubmit={updateCustomerPoints}>
                        <input type="text" placeholder="Customer Id " name="customerId" />
                        <input type="text" placeholder="Amount Purchased " name="amountPurchased" onChange={(e) => calcReward(e)} />
                        <input type="text" placeholder="Rewards " name="reward" value={reward} />
                        <button style={{ borderRadius: '20px', backgroundColor: 'blue', color: 'white', padding: '10px 20px', border: 'none', cursor: 'pointer' }} type='submit' >Update </button>
                      </form>

                      <button onClick={togglePopup} style={{ borderRadius: '20px', backgroundColor: 'red', color: 'white', padding: '10px 20px', border: 'none', cursor: 'pointer' }}>Exit </button>
                    </div>
                  </div>
                </div>
              )} 


            </div>

          </div>
          <Link to="/logout" className="logout-button">Logout</Link>

        </div>
      </div>
    </div>



  )
}

export default Dashboard