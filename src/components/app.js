/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import { createDB, getData, addData, deleteData } from "./indexeddb";
function app() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [img, setImg] = useState("");
  const [allData, setAllData] = useState([]);
  const [selectedRow, setSelectedRow] = useState({});
  const [data, setData] = useState("ADD");
  const [buttonClicked, setbutton] = useState("");
  useEffect(() => {
    createDB("UnifoIndexedDB", 1);
    getAllData();
  }, []);
  const getAllData = async () => {
    const Data = await getData();
    setAllData(Data);
    setSelectedRow({});
    setName("");
    setPrice("");
    setImg("");
    setData("ADD");
    setbutton("");
  };
  const handleSubmit = async (event) => {
    let selected, key;
    if (data === "EDIT") {
      selected = allData.filter((row) => row.key === selectedRow.key);
      key = selected[0].key;
    }
    let obj = {
      key: key ? key : allData[allData.length - 1].key + 1,
      prodName: name,
      price: parseInt(price),
      img: img
    };
    await addData(obj, obj.key);
    getAllData();
  };
  const handleDelete = (selected) => {
    deleteData(selected);
    getAllData();
  };
  return (
    <div className="row" style={{ padding: 100 }}>
      <div className="col-md-6">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>SR No</th>
              <th>Product Name</th>
              <th>Product Price</th>
              <th>Product Image</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {allData?.map((row) => (
              <tr key={row?.key}>
                <td>{row?.key}</td>
                <td>{row?.prodName}</td>
                <td>{row?.price}</td>
                <td>
                  <img
                    src={row?.img}
                    alt={row?.key}
                    className="img-thumbnail"
                    style={{ height: "5rem", width: "5rem" }}
                  />
                </td>
                <td>
                  <button
                    className="btn btn-success"
                    onClick={() => {
                      setSelectedRow(row);
                      setName(row?.prodName);
                      setPrice(row?.price);
                      setImg(row?.img);
                      setData("EDIT");
                      setbutton("Edit");
                    }}
                  >
                    Edit
                  </button>{" "}
                  &nbsp;{" "}
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      handleDelete(row.key);
                    }}
                  >
                    delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          className="btn btn-primary md-2 float-end   "
          onClick={() => {
            setSelectedRow({});
            setName("");
            setPrice("");
            setImg("");
            setData("ADD");
            setbutton("Add");
          }}
        >
          Add
        </button>
      </div>
      {buttonClicked === "Add" || buttonClicked === "Edit" ? (
        <div className="col-md-6">
          <div className="card" style={{ padding: "20px" }}>
            <h3>{data} Data</h3>
            <div className="form-group">
              <label>product Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </div>
            <div className="form-group">
              <label>product Price</label>
              <input
                type="Number"
                name="name"
                className="form-control"
                onChange={(e) => setPrice(e.target.value)}
                value={price}
              />
            </div>
            <div className="form-group">
              <label>product Image URL</label>
              <input
                type="text"
                name="name"
                className="form-control"
                onChange={(e) => setImg(e.target.value)}
                value={img}
              />
            </div>
            <div className="form-group">
              <button className="btn btn-primary mt-2" onClick={handleSubmit}>
                {data}
              </button>
              <button 
              className="btn btn-primary mt-2 float-end" 
              onClick={()=>{
                setbutton(''); 
                setName(''); 
                setPrice(''); 
                setImg('')
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
export default app;
