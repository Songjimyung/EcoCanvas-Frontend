import Grid from "@mui/material/Grid";
import Pagination from "@mui/material/Pagination";

export default function PaiginationComponent({
  currentPage,
  contentPerPage,
  pageCount,
  handlePageChange,
}) {
  const handleChange = (event, page) => {
    handlePageChange(page);
  };

  return (
    <Grid container justifyContent="center" sx={{ marginBottom: "30px" }}>
      <Pagination
        count={Math.ceil(pageCount / contentPerPage)}
        page={currentPage}
        color="primary"
        onChange={handleChange}
      />
    </Grid>
  );
}
