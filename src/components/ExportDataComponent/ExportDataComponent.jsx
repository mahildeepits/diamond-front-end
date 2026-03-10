import { Box, Button } from "@mui/material";
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
export default function ExportDataComponent({handleClickExport}) {
  return (
    <Box sx={{ display: "flex", gap: "10px", mb: { xs: "10px", sm: 0 } }}>
      <Button variant="outlined" startIcon={<PictureAsPdfRoundedIcon />} onClick={() => handleClickExport('pdf')}>
        PDF
      </Button>
      <Button variant="outlined" startIcon={<ArticleRoundedIcon />} onClick={() => handleClickExport('excel')}>
        Excel
      </Button>
    </Box>
  );
}
