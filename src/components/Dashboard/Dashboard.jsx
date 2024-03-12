import React, { useEffect, useState } from 'react'
import { BarChart } from './BarChart';
import { CardList } from './CardList';
import { PieChart } from './PieChart';
import { BsJustify } from 'react-icons/bs';
import { LineChart } from './LineChart';
import "./Dashboard.css";
import logo from "../../img/logo.png"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export function Dashboard({OpenSidebar}) {
   
    const [loginData, setLoginData] = useState('image');
    const [login, setLogin] = useState('image');

  

    const getEmailFromLocalStorage = () => {
      const userEmail = localStorage.getItem('name');
      setLoginData(userEmail);
    //   toast.success("Login successfull");
      const loginImage=localStorage.getItem('image')
      setLogin(loginImage)
   
  
      if (userEmail?.includes('@')) {
        const slicedEmail = userEmail.slice(0, userEmail.indexOf('@'));
        setLoginData(slicedEmail);
      } else {
        setLoginData('Name Not Found');
      }
    };


    useEffect(() => {
      getEmailFromLocalStorage();
    }, []);
    return (
        <div className="container-fluid p-3">
            <div className='menu-icon'>
            <BsJustify  className='icong' onClick={OpenSidebar}/>
            </div>

            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800" >Dashboard</h1>

                <div className='user-con'>
                <img id='logimg' src={login}  alt="" />
                <div id="text">
                <h2 id='name'>{loginData}</h2>
                {/* <p id='cmpname' >Techjays</p> */}
                <img src={logo} className="techimg" alt="" />
                </div>
            </div>

            </div>
            <CardList />
            <div className="row">

                <div className="col-xl-8 col-lg-7 chart">
                    <div className="card shadow mb-4">
                        <div className="card-header py-3">
                            <h6 className="m-0 font-weight-bold text-primary" title='Employees and Workdone'>Employees and Workdone</h6>
                        </div>
                        <div className="card-body">
                            <div className="chart-bar">
                                <BarChart />
                            </div>
                        </div>
                    </div>

                </div>
                <div className="col-xl-4 col-lg-7 chart">
                    <div className="card shadow mb-4">
                        <div className="card-header py-3">
                            <h6 className="m-0 font-weight-bold text-primary" title='Projects priority'>Projects priority</h6>
                        </div>
                        <div className="card-body">
                            <div className="chart-bar">
                                <PieChart />
                            </div>

                        </div>
                    </div>

                </div>

            </div>
            <div className="col-xl-12 col-lg-7 chart">
                    <div className="card shadow mb-4">
                        <div className="card-header py-3">
                            <h6 className="m-0 font-weight-bold text-primary" title='Projects and Deadlines'>Projects and Deadlines</h6>
                        </div>
                        <div className="card-body">
                            <div className="chart-bar">
                                <LineChart />
                            </div>
                        </div>
                    </div>
                    <ToastContainer autoClose={800} position="top-center" />

                </div>
        </div>
    );
}

export default Dashboard