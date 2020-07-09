import React, {useEffect, useState, ChangeEvent} from 'react';
import './styles.css';
import { FiArrowLeft, FiX } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';
import { Layout, Form, Menu, Row, Col , Select, Input, Popconfirm, Table, Tag, Space, Modal, Button, Pagination } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import api from '../../services/api';
import Product from '../../models/product-model';
import usePagination from '../../utils/pagination';


const { SubMenu } = Menu;
const { Header, Sider, Content } = Layout;
const { Option } = Select;
let productsList: Product[] = [];
   
    const Dashboard = () => {
        
        const columns = [
                {
                    title: 'Name',
                    dataIndex: 'name',
                    key: 'name',
                    render: (text:any) => <a>{text}</a>,
                },
                {
                    title: 'Description',
                    dataIndex: 'description',
                    key: 'description',
                },
                {
                    title: 'Price',
                    dataIndex: 'price',
                    key: 'price',
                },
                {
                    title: 'Stock',
                    dataIndex: 'stock',
                    key: 'stock',
                },
                {
                title: 'Category',
                key: 'category',
                dataIndex: 'category',
                render: (category: any) => (
                    <>
                    {
                        <Tag color={'blue'} key={category}>
                            {category.toUpperCase()}
                        </Tag>
                    }
                    </>
                ),
                },
                {
                title: 'Action',
                key: 'action',
                render: (record: any) => (
                    <Space size="middle">
                    
                    <a onClick={() => handleUpdate(record)}>Update</a>

                   
                    <Popconfirm title="Sure to delete?" onConfirm={() => (handleDelete(record))}>
                      <a>Delete</a>
                    </Popconfirm>
                    {/* <a>Delete</a> */}
                    </Space>
                ),
                },
        ];
                  
        
        const [formData, setFormData] = useState({name:'', description:'', category: '', price: 0, stock: 0});
        const [itemFilter, setItemFilter] = useState<String>('name');
        const [textFilter, setTextFilter] = useState<String>("");
        const [visible, setVisible] = useState<boolean>();
        const [isFetching, setIsFetching] = useState<boolean>();
        const [isSearching, setIsSearching] = useState<boolean>();
        const [loading, setLoading] = useState<boolean>();
        const [products, setProducts] = useState<Product[]>([]);
        const [paginatedProducts, currentPage, setCurrentPage, pageSize] = usePagination(products);
        const [total, setTotal] = useState<Number>();
        const [skips, setSkips] = useState<Number>(0);
        const [editable, setEditable] = useState<boolean>();
        const [idUpdate, setIdUpdate] = useState<String>();
        const [initialStateForm, setInitialStateForm] = useState({name:'', description:'', category: '', price: 0, stock: 0});
        const history = useHistory();

        const updateProducts = () => {
            setIsFetching(true);
            api.get(`products/list?uuid=${localStorage.getItem('uuid')}&limit=10&offset=${pageSize * (currentPage - 1)}`, {headers: {'Authorization': localStorage.getItem('token')}}).then((res: any) => {
                productsList = res.data.products;
                setIsFetching(false);
                setTotal(res.data.count);
                setProducts(productsList);       
            }).catch(err => {
                console.log(err);
                setIsFetching(false);
                
            });

        }



        const showModal = () => {
            setVisible(true);
        };
        
        const handleOkInsert = async () => {
            setLoading(true);

            const {name, description, category, price, stock} = formData;
    
            const data = {
                name,
                description,
                category,
                price: Number(price),
                stock: Number(stock),
                uuid: localStorage.getItem('uuid')
            }
            console.log(data);
            
            await api.post('products/create', data, {headers: {'Authorization': localStorage.getItem('token')}}).then(response => {
                console.log('Atenpt to create product');   
                console.log(response.data);
                setFormData(initialStateForm);
                updateProducts();
                setLoading(false);         
                setVisible(false);
            }).catch((err) => {
                alert(err);                
            });
        };

        const handleOkUpdate = async () => {
            setLoading(true);

            const {name, description, category, price, stock} = formData;
            const uuidProduct = products.filter(item => {if(item._id === idUpdate) return item}).map(item => item.uuid).pop();
            console.log(uuidProduct);
            console.log(idUpdate);
        
            const data = {
                _id: idUpdate,
                name,
                description,
                category,
                price: Number(price),
                stock: Number(stock),
                user: localStorage.getItem('uuid')
            }
            
            await api.put(`products/update/${uuidProduct}`, data, {headers: {'Authorization': localStorage.getItem('token')}}).then(response => {
                console.log(response.data);
                setFormData(initialStateForm);
                updateProducts();
                setLoading(false);         
                setVisible(false);
                setEditable(false);
            }).catch((err) => {
                console.log(err);
                alert(err);         
            });
        };
    
        const handleCancel = () => {
            setVisible(false);
            setEditable(false);
            setFormData(initialStateForm);
        };
        
        useEffect(() => {
            
            api.get('users/authentication',{headers: {'Authorization': localStorage.getItem('token')}}).then((res: any) => {
                console.log(res);
                if(res.data.authenticate == false){
                    history.push('/');
                    alert('Error, you\'re not allowed. Please log in again');    
                }
            }).catch(err => {
                console.log(err);
                alert('Error, please contact the admin');         
            });

            
        }, []);

        useEffect(() => {
            console.log(currentPage);
            console.log(skips);
            
            
            setIsFetching(true);
            api.get(`products/list?uuid=${localStorage.getItem('uuid')}&limit=10&offset=${pageSize * (currentPage - 1)}`, {headers: {'Authorization': localStorage.getItem('token')}}).then((res: any) => {
                productsList = res.data.products;
                setIsFetching(false);
                setTotal(res.data.count);
                setProducts(productsList);     
            }).catch(err => {
                console.log(err);
                setIsFetching(false);
                alert('Error, please contact the admin');         
            });
        }, []);

        useEffect(() => {
           setIsFetching(true);
           setSkips((pageSize * (currentPage - 1)));

           if(isSearching === true){
            api.get(`products/list?uuid=${localStorage.getItem('uuid')}&limit=10&offset=${pageSize * (currentPage - 1)}&${itemFilter}=${textFilter}`, {headers: {'Authorization': localStorage.getItem('token')}}).then((res: any) => {           
                productsList = res.data.products;
                setIsFetching(false);
                setTotal(res.data.count);
                setProducts(productsList);     
                }).catch(err => {
                    console.log(err);
                    setIsFetching(false);
                    alert('Error, please contact the admin');         
                });
           }else{
            api.get(`products/list?uuid=${localStorage.getItem('uuid')}&limit=10&offset=${pageSize * (currentPage - 1)}`, {headers: {'Authorization': localStorage.getItem('token')}}).then((res: any) => {           
                productsList = res.data.products;
                setIsFetching(false);
                setTotal(res.data.count);
                setProducts(productsList);     
                }).catch(err => {
                    console.log(err);
                    setIsFetching(false);
                    alert('Error, please contact the admin');         
                });
           }
           
        }, [currentPage]);

       

        const handleLogout = async () => {

            await api.get('users/logout', {headers: {'Authorization': localStorage.getItem('token')}}).then(response => {
                console.log(response);
                localStorage.setItem('token', '');
                localStorage.setItem('uuid', '');
                history.push('/');         
            }).catch((err) => {
                console.log(err);
                alert('Error, please contact the admin');         
            });

        }

        const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
            const {name, value} = event.target;
            setFormData({...formData, [name]:value});
            console.log(formData);
            
        }

        const handleInputFilterSelect = (value: any) => {
            setItemFilter(value);            
        }

        
        const handleInputTextSelect = (event: ChangeEvent<HTMLInputElement>) => {
            const {value} = event.target;
            setTextFilter(value);
        }

        const handleSeach = () => {
            setIsSearching(true);
            setIsFetching(true);
            api.get(`products/list?uuid=${localStorage.getItem('uuid')}&limit=10&offset=${pageSize * (currentPage - 1)}&${itemFilter}=${textFilter}`, {headers: {'Authorization': localStorage.getItem('token')}}).then((res: any) => {
                productsList = res.data.products;
                setIsFetching(false);
                setTotal(res.data.count);
                setProducts(productsList);     
            }).catch(err => {
                alert(err);
                setIsFetching(false);
                alert('Error, please contact the admin');         
            });
        }

        const handleClearSearch = () => {
            setTextFilter("");
            setIsSearching(false);
            setIsFetching(true);
            api.get(`products/list?uuid=${localStorage.getItem('uuid')}&limit=10&offset=${pageSize * (currentPage - 1)}`, {headers: {'Authorization': localStorage.getItem('token')}}).then((res: any) => {
                productsList = res.data.products;
                setIsFetching(false);
                setTotal(res.data.count);
                setProducts(productsList);     
            }).catch(err => {
                console.log(err);
                setIsFetching(false);
                alert('Error, please contact the admin');         
            });
        }
        
        const handleUpdate = (row: Product) => {
            setEditable(true);
            setIdUpdate(row._id);            
            setFormData(row);
            setVisible(true);

        }

        const handleDelete = (row: Product) => {
            setIsFetching(true);
            setProducts(products.filter(item => item._id != row._id));
            api.delete(`products/delete/${row._id}`, {headers: {'Authorization': localStorage.getItem('token')}}).then((res: any) => {
                alert("Operation completed successfully");     
                updateProducts();
            }).catch(err => {
                alert(err);
            });
        } 

        return(
            <Layout >
                <Header style={{background: '#F9FAFB', paddingLeft: '0px', paddingRight: '0px'}}>
                <Row>
                    <Col span={3}>
                        <img src={'https://dewey.tailorbrands.com/production/brand_version_mockup_image/203/3268607203_72bf8960-10a3-4fe8-916a-265f15c08870.png?cb=1593984400'} width={200} alt="XPTO"/>
                    </Col>
                    <Col span={17} style={{display: 'flex', alignContent: 'center',  left: '16%'}}>
                        <Input.Group compact style={{padding: '12px 0 0 30px'}}>
                            <Select defaultValue="name" style={{width: '110px'}} onChange={handleInputFilterSelect}>
                                <Option value="name">Name</Option>
                                <Option value="description">Description</Option>
                                <Option value="category">Category</Option>
                            </Select>
                            <Input.Search style={{ width: '30%' }} value={String(textFilter)} onChange={handleInputTextSelect} onSearch={handleSeach}  />
                            <Button style={{marginLeft: '5px'}} type="ghost" onClick={handleClearSearch}>
                                <FiX style={{marginTop: '4px'}}/>
                            </Button>

                        </Input.Group>
                    </Col>
                    <Col span={4} style={{display: 'flex', alignContent: 'center', justifyContent: 'center'}}>
                        <Link to="#" onClick={handleLogout}>
                        <FiArrowLeft/> Exit
                        </Link>
                    </Col>
                </Row>    
                </Header>           
                <Layout >
                <Sider style={{minHeight: '90vh', background: '#F9FAFB'}}>
                <Menu onClick={() => {}} style={{ width: 200.4 }}  defaultOpenKeys={['sub1']} mode="inline">
                    <SubMenu key="sub1" title={<span> <MailOutlined /> <span>Menu</span> </span>}>
                        <Menu.Item key="1">Dashboard</Menu.Item>
                    </SubMenu>
                </Menu>
                </Sider>
                <Content style={{background: '#E5E5E5', paddingLeft: '7px', paddingRight: '7px', paddingBottom: '7px'}}>
                    <Row style={{paddingTop: '7px'}}>
                        <Col span={24}>
                            <Row style={{paddingTop: '7px', paddingBottom: '7px', paddingLeft: '7px', backgroundColor: 'white'}}>
                                <Col span={24}>
                                    <Button ref={null} type="primary" onClick={showModal}>
                                            Add Product
                                    </Button>
                                </Col>
                            </Row>
                            <Row style={{padding: '7px', backgroundColor: 'white'}}>
                                <Col span={24}>
                                    <Table rowKey={record => record._id} columns={columns} dataSource={products} pagination={false} loading={isFetching}/>
                                    {/* pagination={pagination} */}
                                    <Pagination key={"pagination"} 
                                                current={currentPage} 
                                                onChange={setCurrentPage} 
                                                pageSize={pageSize}
                                                total={Number(total)}
                                                size="small"/>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Content>
                </Layout>



                <Modal visible={visible} title="Adding product" onCancel={handleCancel} footer={[
                        <Button key="back" onClick={handleCancel}>
                            Return
                        </Button>,
                        editable ? (
                            <Button key="submit" type="primary" loading={loading} onClick={handleOkUpdate}>
                                Save
                            </Button>
                            ): (
                            <Button key="submit" type="primary" loading={loading} onClick={handleOkInsert}>
                                Submit
                            </Button>
                            )
                    ]}
                    >
                    <Form labelCol={{ span: 4 }}
                                  wrapperCol={{ span: 14 }}
                                  layout="horizontal"
                                  initialValues={{ size: 'small' }}
                                  size={'small'}>


                                <Form.Item>
                                    <Input type="text" name="name" placeholder="Name" id="name" value={formData.name} onChange={handleInputChange}/>
                                </Form.Item>
                                <Form.Item>
                                    <Input type="text" name="description" placeholder="Description" id="description" value={formData.description} onChange={handleInputChange}/>
                                </Form.Item>
                                <Form.Item>
                                    <Input  type="text" name="category" placeholder="Category" id="category" value={formData.category} onChange={handleInputChange}/>
                                </Form.Item>
                                <Form.Item>
                                    <Input  type="number" name="price" placeholder="Price" id="price" value={formData.price} onChange={handleInputChange}/>
                                </Form.Item>
                                <Form.Item>
                                    <Input  type="number" name="stock" placeholder="Stock" id="stock" value={formData.stock} onChange={handleInputChange}/>
                                </Form.Item>
                          </Form>
                </Modal>
            </Layout>
        );


    }

export default Dashboard;