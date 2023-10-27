import React, { useEffect, useState } from "react";

import css from "../styles/user.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { postUser, getUser, deleteUser } from "../utils/axios";
import { Button, Modal, Input, Table, Popconfirm, Skeleton } from "antd";
import Search from "antd/es/input/Search";

function User() {
  const [loadcreate, setLoadcreate] = useState(false);
  const [loadDelete, setLoadDelete] = useState(false);
  const [loadData, setLoadData] = useState(false);
  const [name, setName] = useState(null);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [status, setStatus] = useState(null);
  const [search, setSearch] = useState("all");
  const [datauser, setDatauser] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const column = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Nama lengkap",
      dataIndex: "namalengkap",
      key: "namalengkap",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "password",
      dataIndex: "password",
      key: "password",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div>
          <Popconfirm
            title="Delete User"
            description="Apakah Kamu Yakin Ingin Delete User Ini?"
            okText="Iya"
            cancelText="Tidak"
            onConfirm={() => deleteAcc(record.id)}
          >
            <Button loading={loadDelete} danger>
              delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  // get value
  const handleName = (e) => {
    setName(e.target.value);
  };
  const handleUsername = (e) => {
    setUsername(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };
  const handleStatus = (e) => {
    setStatus(e.target.value);
  };

  const handleCancel = () => {
    setName("");
    setUsername("");
    setPassword("");
    setStatus("");
    setOpenModal(false);
  };

  const Createuser = async () => {
    try {
      setLoadcreate(true);
      if (!name || !username || !password || !status)
        return (
          toast.error("Data input must be fullfilled"), setLoadcreate(false)
        );
      const response = await postUser({
        namalengkap: name,
        username: username,
        password: password,
        status: status,
      });
      // console.log(response.data)
      setSearch("all");
      const result = await getUser(`${search}`);
      setDatauser(result.data.data);
      toast.success(response.data.msg);
      setName("");
      setUsername("");
      setPassword("");
      setStatus("");
      setLoadcreate(false);
      setOpenModal(false);
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.msg);
      setLoadcreate(false);
    }
  };

  const deleteAcc = async (id_user) => {
    try {
      setLoadDelete(true);
      await deleteUser(id_user);
      const result = await getUser(`${search}`);
      setDatauser(result.data.data);
      toast.success("Delete Success");
      setLoadDelete(false);
    } catch (err) {
      console.log(err);
      toast.error("Delete Failed");
      setLoadDelete(false);
    }
  };

  useEffect(() => {
    getUser(`${search}`)
      .then((res) => {
        setLoadData(true);
        setDatauser(res.data.data);
        setLoadData(false);
      })
      .catch((err) => {
        setDatauser([]);
        setLoadData(false);
      });
  }, [search]);

  return (
    <>
      <ToastContainer />
      <div className="container my-5 py-5">
        <div>
          <div className="d-flex flex-row align-items-center">
            <div className="d-flex flex-row align-items-center w-100">
              <div className="w-25">
                <Search
                  placeholder="input search text"
                  onSearch={(e) => {
                    if (e === "") e = 'all'
                    setSearch(e);
                  }}
                  enterButton
                  styles={"w-25"}
                />
              </div>
              <p className={css.noted}>
                Noted! search all for see all user and you can search user by id
              </p>
            </div>
            <Button type="primary" onClick={() => setOpenModal(true)}>
              Tambahkan User
            </Button>
          </div>
        </div>
          <Table columns={column} dataSource={datauser} />
        {loadData?<Skeleton />:null}
      </div>
      <Modal
        title="Form Pengisian Data"
        centered
        open={openModal}
        onOk={() => Createuser()}
        onCancel={() => handleCancel()}
        okText={"Simpan"}
        okButtonProps={{ loading: loadcreate }}
      >
        <div className="d-flex flex-column gap-2">
          <div>
            <p>Nama Lengkap :</p>
            <Input
              value={name}
              onChange={handleName}
              placeholder="Input Nama Lengkap Disini"
            />
          </div>
          <div>
            <p>Username :</p>
            <Input
              value={username}
              onChange={handleUsername}
              placeholder="Input Nama Username Disini"
            />
          </div>
          <div>
            <p>Password :</p>
            <Input.Password
              value={password}
              onChange={handlePassword}
              placeholder="Input Nama Password Disini"
            />
          </div>
          <div>
            <p>Status :</p>
            <Input
              value={status}
              onChange={handleStatus}
              placeholder="Input Nama Status Disini"
            />
          </div>
        </div>
      </Modal>
    </>
  );
}

export default User;
