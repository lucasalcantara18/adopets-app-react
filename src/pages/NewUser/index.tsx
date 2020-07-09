import React, { useState, ChangeEvent } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom'
import './styles.css';
import { Layout, Form, Menu, Select, Input, Button } from 'antd';
import api from '../../services/api';


const NewUser = () => {
    

  const history = useHistory();
  const [formData, setFormData]= useState({name: '', email: '', password: ''});
   
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target;
    setFormData({...formData, [name]:value});
    console.log(formData);
    
  }
   
  const handleInputSubmit = async () => {
    
    const {name , email, password} = formData;
    
    const data = {
        name,
        email,
        password
    }

    await api.post('users/register', data).then(response => {
        alert('Success, now you can login');
        history.push('/');         
    }).catch((err) => {
        console.log(err);
        alert(err);                 
    });
    
}
   

        return (
            <div id="page-signin">
                <div className="content">
                    <header>
                        <img src={'https://dewey.tailorbrands.com/production/brand_version_mockup_image/203/3268607203_72bf8960-10a3-4fe8-916a-265f15c08870.png?cb=1593984400'} width={100} alt="Ecoleta"/>
                        <Link to="/">
                          <FiArrowLeft/> Return to home page
                        </Link>
                    </header>
                    
                    <main>
                        <h1>XPTO Inventory Solutions</h1>
                        <p>Manage your inventory with the excellence <br /> that our solution provides, <br /> just fill the data below and start using</p>

                        <Form labelCol={{ span: 4 }}
                                  wrapperCol={{ span: 14 }}
                                  layout="horizontal"
                                  initialValues={{ size: 'small' }}
                                  size={'small'}>


                                <Form.Item>
                                    <Input type="text" name="name" placeholder="Name" id="name" onChange={handleInputChange}/>
                                </Form.Item>
                                <Form.Item>
                                    <Input type="email" name="email" placeholder="Email" id="email" onChange={handleInputChange}/>
                                </Form.Item>
                                <Form.Item>
                                    <Input  type="password" name="password" placeholder="Password" id="password" onChange={handleInputChange}/>
                                </Form.Item>
                                <Form.Item>
                                  <Button key="submit" type="primary" onClick={handleInputSubmit}>
                                      Submit
                                  </Button>
                                </Form.Item>
                          </Form>
                    </main>
                </div>
            </div>
        );
  }

export default NewUser;