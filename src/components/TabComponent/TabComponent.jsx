/* eslint-disable react/prop-types */
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0, mt: 1 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function TabComponent({
  tabTitles,
  components,
  selectedTab,
  setSelectedTab,
}) {
  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Box>
      <Box>
        <Tabs
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          TabIndicatorProps={{
            style: { height: "4px" },
          }}
          textColor="inherit"
          sx={{
            "& .Mui-selected": {
              color: "primary.main",
            },
            "& .MuiTab-root": {
              width: "auto",
              color: "white",
              fontSize: 18,
              textTransform: "capitalize",
              borderRadius: "100px ",
              mx: 0.5,
              fontWeight: 500,
              fontFamily: "'Jost', sans-serif",
            },
          }}
          value={selectedTab} // Use external state for value
          onChange={handleChange}
        >
          {tabTitles.map((title, index) => (
            <Tab
              disableRipple
              key={index}
              label={title}
              {...a11yProps(index)}
            />
          ))}
        </Tabs>
      </Box>
      {components.map((component, index) => (
        <CustomTabPanel key={index} value={selectedTab} index={index}>
          {component}
        </CustomTabPanel>
      ))}
    </Box>
  );
}
