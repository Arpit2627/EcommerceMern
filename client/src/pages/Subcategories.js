import React ,{useState,useEffect}from "react";
import axios from "axios";
import { Link ,useParams} from "react-router-dom";
// import useSubCategory from "../hooks/useSubcategory";
import Layout from "../components/Layout/Layout";
const SubCategories = () => {
  // const categories = useSubCategory();
  const params = useParams();
  const [subcategories, setSubCategories] = useState([]);
  const getCategories = async () => {
    try {
      const { data } = await axios.get(`/api/v1/subcategory/get-sub-category/${params.id}`);
      console.log(data,"ddd");
      setSubCategories(data?.data);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(subcategories,"ssss");
  useEffect(() => {
    getCategories();
  }, [params?.id]);
  //in the above params we get parentcategory id
  return (
    <Layout title={"All Categories"}>
      <div
        className="container"
        style={{ marginTop: "100px", backgroundColor: "rgb(241, 242, 244)" }}
      > 
      <h1 className="text-center">SubCategories</h1>
        <div className="row container">
          {subcategories?.map((c) => (
            <div className="col-md-4 mt-5 mb-3 gx-3 gy-3" key={c._id}>
              <div className="card bg-light bg-gradient">
                <Link
                  to={`/category/subcategory/${c?._id}`}
                  className="btn p-4"
                  style={{
                    background: "#fff",
                    transition: "background 0.3s",
                  }}
                  onMouseOver={(e) => (e.target.style.background = "#99aab5")}
                  onMouseOut={(e) => (e.target.style.background = "#fff")}
                >
                  {c.name}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default SubCategories;
