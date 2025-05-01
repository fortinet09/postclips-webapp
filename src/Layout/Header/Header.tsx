import { Col, Row } from "reactstrap";
import HeaderLogo from "./HeaderLogo";
import SearchInput from "./SearchInput/SearchInput";
import RightHeaderIcon from "./RightHeaderIcon/RightHeaderIcon";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useEffect } from "react";
import { headerResponsive } from "@/Redux/Reducers/Layout/LayoutSlice";
import { ECommerceTitle } from "@/Constant";
import { AddProductTitle } from "@/Constant";
import Breadcrumbs from "@/CommonComponent/BreadCrumbs";

const Header = () => {
  const { toggleSidebar } = useAppSelector((state) => state.layout);
  const { currentPage } = useAppSelector((state) => state.header);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(headerResponsive());
  }, []);

  return (
    <div className={`page-header ${toggleSidebar ? "close_icon" : ""}`}>
      <Row className='header-wrapper m-0'>
        <HeaderLogo />
        {/* <SearchInput /> */}
        <Col xxl={5} xl={4} md={4} className="left-header col-auto box-col-6 horizontal-wrapper p-0" >
          <Breadcrumbs title={currentPage} />
        </Col>
        <RightHeaderIcon />
      </Row>
    </div>
  );
};
export default Header;