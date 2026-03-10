/* eslint-disable react/prop-types */
import { Box, Typography } from "@mui/material";
import TabComponent from "../TabComponent/TabComponent";
import BankDetailsFormComponent from "./BankDetailsFormComponent";
export default function BankDetailsComponent({
  bankDetails,
  selectedTab,
  setSelectedTab,
  isAddingNewBank,
  onSaveNewBank,
  isAdding,
  setOpenDelete,
  isAdmin
}) {
  const tabTitles = bankDetails.map((bm, index) => (bm.name || `Bank ${index + 1}`));
  if (isAddingNewBank) {
    tabTitles.push(`New Bank`);
  }
  const components = bankDetails.map((bank, index) => (
    <BankDetailsFormComponent
      onSave={onSaveNewBank}
      key={index}
      bank={bank}
      isNew={!bank.id}
      id={bank.id}
      setOpenDelete={setOpenDelete}
      isDisabled={!isAdmin}
    />
  ));
  if (isAddingNewBank) {
    components.push(
      <BankDetailsFormComponent
        key="new-bank"
        bank={{}}
        isNew
        onSave={onSaveNewBank}
        isAdding={isAdding}
        isDisabled={!isAdmin}
      />
    );
  }
  return (
    <Box>
      {bankDetails.length > 0 || isAddingNewBank ? (
        <TabComponent
          tabTitles={tabTitles}
          components={components}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      ) : (
        <Box>
          <Typography>No bank details added</Typography>
        </Box>
      )}
    </Box>
  );
}
