import RArrow from "../../../assets/right-arrow.svg";
import styled from "styled-components";
import { DOTS, usePagination } from "./PaginationHook";

const PageNum = styled.div`
  display: flex;
  align-items: center;
  column-gap: 0.5rem;
`;

const NavItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2rem 0;
  width: fit-content;
`;

const PageLink = styled.button`
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  border-radius: 4px;
  text-align: center;
  font-size: 1.3rem;
  cursor: pointer;
  background-color: ${props => (props.selected ? "#ADC178" : "#ADC17833")};
  color: ${props => (props.selected ? "#ffffff" : "#6C584C")};
  @media only screen and (max-width: 768px) {
    display: none;
  }
`;

const PagesMobile = styled.div`
  display: none;
  color: #6c584c;
  @media only screen and (max-width: 768px) {
    font-size: 1rem;
    display: block !important;
  }
`;
const PrevPage = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0.5rem 0.875rem;
  gap: 0.5rem;
  border: 1px solid #6c584c;
  width: 7.25rem;
  height: 2.3rem;
  background-color: #ffffff;
  box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05);
  border-radius: 4px;
  cursor: pointer;
  margin: 0 0.5rem;
  @media only screen and (max-width: 768px) {
    width: auto !important;
  }
`;
const NextPage = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0.5rem 0.875rem;
  gap: 0.5rem;
  border: 1px solid #6c584c;
  width: 7.25rem;
  height: 2.3rem;
  background-color: #ffffff;
  box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05);
  border-radius: 4px;
  cursor: pointer;
  margin: 0 0.5rem;
  @media only screen and (max-width: 768px) {
    width: auto !important;
  }
`;
const Prev = styled.div`
  @media only screen and (max-width: 768px) {
    display: none;
  }
`;
const Next = styled.div`
  @media only screen and (max-width: 768px) {
    display: none;
  }
`;

const LeftArrow = styled.img`
  transform: rotate(180deg);
  opacity: ${props => (props.disabled ? 0.3 : 1)};
`;
const RightArrow = styled.img`
  opacity: ${props => (props.disabled ? 0.3 : 1)};
`;

function Pagination(props) {
  const {
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize,
  } = props;

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  // If there are less than 2 times in pagination range we shall not render the component
  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  const lastPage = paginationRange[paginationRange.length - 1];
  return (
    <NavItem>
      {/*  Left navigation arrow  FIX- disabled: currentPage === 1  */}
      <PrevPage onClick={onPrevious} disabled={currentPage === 1}>
        <LeftArrow disabled={currentPage === 1} src={RArrow} />
        <Prev>Previous</Prev>
      </PrevPage>
      <PageNum>
        {paginationRange.map(pageNumber => {
          // If the pageItem is a DOT, render the DOTS unicode character
          if (pageNumber === DOTS) {
            return (
              <PageLink key={Math.floor(Math.random() * (3000 - 1)) + 1}>
                &#8230;
              </PageLink>
            );
          }

          // Render our Page Pills Fix- selected: pageNumber === currentPage
          return (
            <PageLink
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              selected={pageNumber === currentPage}
            >
              {pageNumber}
            </PageLink>
          );
        })}
        <PagesMobile>
          Page {currentPage} of {lastPage}
        </PagesMobile>
      </PageNum>
      {/*  Right Navigation arrow  fix -disabled: currentPage === lastPage */}
      <NextPage onClick={onNext} disabled={currentPage === lastPage}>
        <Next>Next</Next>
        <RightArrow disabled={currentPage === lastPage} src={RArrow} />
      </NextPage>
    </NavItem>
  );
}
export default Pagination;
