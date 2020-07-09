import React, {useState, ChangeEvent } from 'react';
import { FiLogIn } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom'
import './styles.css';
import { Form, Input } from 'antd';
import api from '../../services/api';




const Home = () =>{

    const history = useHistory();
    const [formLayout, setFormLayout]= useState<string>();
    const [formData, setFormData]= useState({name: '', email: '', password: ''});

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setFormData({...formData, [name]:value})       
    }

    const handleInputSubmit = async () => {
    
        const {email, password} = formData;
        
        const data = {
            email,
            password
        }
        await api.post('users/login', data).then(response => {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('uuid', response.data.user.uuid);
            history.push('/dashboard');         
        }).catch((err) => {
            console.log(err);
            alert('Wrong Email or password, plase try again');                 
        });
        
    }
    
          return (
            <div id="page-home">
                <div className="content">
                    <header>
                        <img src={'https://dewey.tailorbrands.com/production/brand_version_mockup_image/203/3268607203_72bf8960-10a3-4fe8-916a-265f15c08870.png?cb=1593984400'} width={100} alt="Ecoleta"/>
                    </header>

                    <main>
                        <h1>XPTO Inventory Solutions</h1>
                        <p>The best place to manage your inventory.</p>

                        

                        <Form labelCol={{ span: 4 }}
                                  wrapperCol={{ span: 14 }}
                                  layout="horizontal"
                                  initialValues={{ size: 'small' }}
                                  size={'small'}>


                                <Form.Item>
                                    <Input type="email" name="email" placeholder="Email" id="email" onChange={handleInputChange}/>
                                </Form.Item>
                                <Form.Item>
                                    <Input  type="password" name="password" placeholder="Password" id="password" onChange={handleInputChange}/>
                                </Form.Item>
                          </Form>

                        <Link className="a" to="#" onClick={handleInputSubmit}>
                            <span><FiLogIn /></span>
                            <strong>Sign In</strong>
                        </Link>
                        <Link style={{paddingTop: '6px'}} to="/register">
                            <strong>Sign Up</strong>
                        </Link>
                    </main>
                </div>
            </div>
        );
}

export default Home;