import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import api from "../../api";
// import AddProduct from "./AddProduct";
import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../../auth/AuthContext";

function TransactionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await api.get(`/transactions/${id}`);
        setTransaction(response.data.payload);
        console.log(transaction);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchTransaction();
    // fetchAttachments();
  }, [id]);

  return (
    <>
      <div className="mt-2 mb-2">
        <div className="bg-white rounded-lg shadow-md px-4 py-6">
          {/* <h1 className="text-2xl font-bold mb-4">Create Transaction</h1> */}

          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800">
              Detail Transaction
            </h1>
            <div>
              <button
                className="w-20 bg-gray-200 text-gray-600 ml-2 rounded px-4 py-2 text-sm hover:bg-gray-300 transition duration-200"
                onClick={() => navigate(-1)} // Membuka modal untuk aksi create
              >
                Back
              </button>
            </div>
          </div>

          <div className="flex  ">
            <div className="w-[40%] mr-2 p-4 mb-4 rounded-md border border-gray-300 text-center flex flex-col items-center justify-center">
              <h2 className="text-xl font-semibold text-gray-800">
                Transaction Time
              </h2>
              <p className="text-lg font-semibold text-blue-700">
                {transaction?.created_at
                  ? new Date(transaction.created_at).toLocaleDateString(
                      "id-ID",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )
                  : "-"}
              </p>
              <p className="text-1xl font-mono text-gray-800">
                {transaction?.created_at
                  ? new Date(transaction.created_at).toLocaleTimeString("id-ID")
                  : "-"}
              </p>
            </div>

            <div className="w-[25%] mx-2 p-4 mb-4 rounded-lg border border-gray-300">
              <div className=" text-gray-800">
                <label className="text-lg font-medium text-gray-700">
                  Customer
                </label>
                <select
                  id="customer"
                  disabled
                  //   value={customerId}
                  //   onChange={(e) => setCustomerId(e.target.value)}
                  className="border border-gray-300 rounded  px-4 py-2  mt-3 w-full"
                >
                  <option value="">{transaction?.customer_name || "-"}</option>
                </select>
              </div>
            </div>

            <div className="w-[35%] ml-2 p-4 mb-4 rounded-lg border border-gray-300">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-lg font-medium text-gray-700">
                    Total Amount
                  </label>
                  <label className="text-lg font-semiboldtext-lg font-medium text-gray-700">
                    Rp {transaction?.total_amount.toLocaleString() || "0"}
                    {/* Rp{" "}
                    {cart
                      .reduce(
                        (total, item) =>
                          total +
                          (item.price -
                            item.price * (item.discount_value / 100)) *
                            item.qty,
                        0
                      )
                      .toLocaleString()} */}
                  </label>
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <div className="flex justify-between items-center">
                  <label className="text-lg font-medium text-gray-700">
                    Chasier
                  </label>
                  <label className="text-lg font-medium text-gray-700">
                    {transaction?.user_name.toLocaleString() || "0"}
                  </label>
                </div>
              </div>

            </div>
          </div>

          <div className="border border-gray-300 rounded-lg text-gray-800 px-4 pb-5">
            <div className="max-h-96 overflow-y-auto mt-3">
              <table className="min-w-full bg-white">
                <thead className="sticky top-0 bg-white z-10">
                  <tr>
                    <th className="border-b-2 border-gray-300 px-4 py-2 text-center w-1/12">
                      #
                    </th>
                    <th className="border-b-2 border-gray-300 px-4 py-2 text-left w-2/6">
                      Name
                    </th>
                    <th className="border-b-2 border-gray-300 px-4 py-2 text-center w-1/12">
                      Disc (%)
                    </th>
                    <th className="border-b-2 border-gray-300 px-4 py-2 text-center w-1/6">
                      Disc (Rp)
                    </th>
                    <th className="border-b-2 border-gray-300 px-4 py-2 text-center w-1/6">
                      Normal Price
                    </th>
                    <th className="border-b-2 border-gray-300 px-4 py-2 text-center w-1/6">
                      Final Price
                    </th>
                    <th className="border-b-2 border-gray-300 px-4 py-2 text-center w-1/12">
                      Quantity
                    </th>
                    <th className="border-b-2 border-gray-300 px-4 py-2 text-center w-1/6">
                      Total Price
                    </th>
                    {/* <th className="border-b-2 border-gray-300 px-4 py-2 text-center w-1/12">
                      Action
                    </th> */}
                  </tr>
                </thead>
                <tbody>
                  {transaction?.products?.length > 0 ? (
                    transaction.products.map((product, index) => (
                      <tr key={product.product_id}>
                        <td className="border-b border-gray-300 px-4 py-2 text-center">
                          {index + 1}
                        </td>
                        <td className="border-b border-gray-300 px-4 py-2 text-left">
                          {product.product_name}
                        </td>
                        <td className="border-b border-gray-300 px-4 py-2 text-center">
                          {product.discount}%
                        </td>
                        <td className="border-b border-gray-300 px-4 py-2 text-center">
                          Rp{" "}
                          {(
                            (product.price * product.discount) /
                            100
                          ).toLocaleString()}
                        </td>
                        <td className="border-b border-gray-300 px-4 py-2 text-center">
                          Rp {product.price.toLocaleString()}
                        </td>
                        <td className="border-b border-gray-300 px-4 py-2 text-center">
                          Rp{" "}
                          {(
                            product.price -
                            (product.price * product.discount) / 100
                          ).toLocaleString()}
                        </td>
                        <td className="border-b border-gray-300 px-4 py-2 text-center">
                          {product.quantity}
                        </td>
                        <td className="border-b border-gray-300 px-4 py-2 text-center">
                          Rp{" "}
                          {(
                            product.quantity *
                            (product.price -
                              (product.price * product.discount) / 100)
                          ).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
                        className="border-b border-gray-300 px-4 py-2 text-center"
                      >
                        No products found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal Form */}
          {/* <AddProduct
            isOpen={isModalOpen}
            closeModal={closeModal} // Menutup modal
            onAddProduct={handleProductSelected}
          /> */}
        </div>
      </div>
    </>
  );
}

export default TransactionDetail;
