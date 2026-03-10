import { useEffect, useState } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import BreadcrumbsComponent from "../../components/BreadcrumbsComponent/BreadcrumbsComponent";
import BankDetailsComponent from "../../components/BankDetailsComponents/BankDetailsComponent";
import { AddCircleOutlined, CancelOutlined } from "@mui/icons-material";
import {
  useAddBankDetailsMutation,
  useDeleteBankDetailsMutation,
  useFetchBankDetailsQuery,
  useUpdateBankDetailsMutation,
} from "../../store";
import { toast } from "react-toastify";
import Loader from "../../components/Loader/Loader";
import { useSelector } from "react-redux";
import DeleteModal from "../../components/ModalComponent/ModalComponent";
import ErrorComponent from "../../components/Loader/ErrorComponent";
import useUserPermissions from "../../utils/useSubAdmin";
export default function BankDetailsPage() {
  const { isSubAdmin } = useUserPermissions();
  const [bankDetails, setBankDetails] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [deleteId, setDeleteId] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [isAddingNewBank, setIsAddingNewBank] = useState(false);
  const { data, isLoading, error } = useFetchBankDetailsQuery();
  const [addBankDetails, { isLoading: isAdding }] = useAddBankDetailsMutation();
  const [updateBankDetails, { isLoading: isUpdating }] =
    useUpdateBankDetailsMutation();
  const [deleteBank, { isLoading: deletingBank }] =
    useDeleteBankDetailsMutation();
  const user = useSelector((state) => {
    return state.CurrentUser.user;
  });
  const userId = user.id;
  const isAdmin = user.is_admin === 1;
  useEffect(() => {
    if (data) {
      if (data.code == 200) {
        setBankDetails(data.data);
        setSelectedTab(bankDetails.length - 1);
      } else if (error) {
        toast.error("Error while fetching bank details");
      }
    }
  }, [data, error, bankDetails]);
  const handleAddBank = () => {
    setIsAddingNewBank(true);
    setSelectedTab(bankDetails.length);
  };
  const handleCancelAddBank = () => {
    setIsAddingNewBank(false);
    setSelectedTab(bankDetails.length - 1);
  };
  const handleSaveNewBank = async (values) => {
    if (isAddingNewBank) {
      try {
        const res = await addBankDetails(values);
        if (res.data.code == 200 || res.data.code == 201) {
          toast.success(res.data.message);
          setIsAddingNewBank(false);
        }
      } catch (error) {
        toast.error(error.message);
      }
    } else {
      try {
        const data = {
          values: values,
          id: userId,
        };
        const res = await updateBankDetails(data);
        if (res.data.code == 200 || res.data.code == 201) {
          toast.success(res.data.message);
          setIsAddingNewBank(false);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  };
  const handleOpenDelete = (id) => {
    setOpenDelete(true);
    setDeleteId(id);
  };
  const handleDelete = async () => {
    const res = await deleteBank({ id: deleteId });
    if (res.data.code == 201 || res.data.code == 200) {
      toast.success("Bank deleted successfully");
      setOpenDelete(false);
    } else {
      toast.error("Error while deleting");
    }
  };
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 1 }}>
        <BreadcrumbsComponent
          breadcrumbs={[<Typography key={1}>Bank Details</Typography>]}
        />
      </Box>
      <Box
        sx={{
          my: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="pageHeading">{isAdmin ? "My Banks" : "Our Bank Details" }</Typography>
        {
          isAdmin && (
            !isAddingNewBank ? (
              <Button
                disabled={isSubAdmin}
                startIcon={<AddCircleOutlined />}
                variant="outlined"
                onClick={handleAddBank}
              >
                Add Bank
              </Button>
            ) : (
              <Button
                startIcon={<CancelOutlined />}
                variant="outlined"
                onClick={handleCancelAddBank}
                color="error"
              >
                Cancel
              </Button>
            )
          )
        }
      </Box>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <ErrorComponent />
      ) : (
        <BankDetailsComponent
          bankDetails={bankDetails}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          isAddingNewBank={isAddingNewBank}
          onSaveNewBank={handleSaveNewBank}
          isAdding={isAdding || isUpdating}
          setOpenDelete={handleOpenDelete}
          isAdmin={isAdmin}
        />
      )}
      {openDelete ? (
        <DeleteModal
          open={openDelete}
          setOpen={setOpenDelete}
          _id={deleteId}
          variant="bank"
          deleteFunc={handleDelete}
          loading={deletingBank}
        />
      ) : null}
    </Container>
  );
}
