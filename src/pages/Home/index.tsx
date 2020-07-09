import React, {useEffect, useState, ChangeEvent, FormEvent} from 'react';
import logo from '../../assets/logo.svg';
import { FiLogIn, FiArrowLeft } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom'
import './styles.css';
import { Layout, Form, Menu, Row, Col , Select, Input, InputNumber, DatePicker, AutoComplete, Cascader, Card,  Table, Tag, Space, Modal, Button } from 'antd';
import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
import { AudioOutlined } from '@ant-design/icons';
import api from '../../services/api';
import axios from 'axios';
import User from '../../models/user-model';




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
            console.log(response);
            
            console.log('Tentativa de login');   
            console.log(response.data);
            
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('uuid', response.data.user.uuid);
            history.push('/dashboard');         
        }).catch((err) => {
            console.log(err);
            alert(err);
            
        });
        
    }
    
   
   
    
    // useEffect(() => {//pegar os itens e imagens do back edn
    //     console.log("ta passando aqui");
        
    //     api.get('services/findAll',{headers: {'Authorization': 'Authorization=Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfdXVpZCI6IjRjZmI5OTIzLTViYjItNGJlNC05NTY3LWIwN2I3OTc4MzUyNyIsImlhdCI6MTU5NDAwMDcxMCwiZXhwIjoxNTk0MDA0MzEwfQ.he7lb_o-SZafNH175DlxdP3ufcdAIsGJeZmz_FYxrVQ'}}).then((res: any) => {
    //         console.log(res);
    //     })
    // }, []);

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