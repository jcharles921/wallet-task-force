import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  Paper,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { CustomButton } from "../../containers/Buttons";
import { Delete, Edit } from "@mui/icons-material";
import { RootState, AppDispatch } from "../../store";
import apis from "../../store/api";
import Loader from "../../containers/Loader";
import styles from "../../styles/global.module.css";

interface Category {
  id: number;
  name: string;
  parent_id: number | null;
}

const Categories = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Redux state
  const categories = useSelector(
    (state: RootState) => state.categories.data as Category[]
  );
  const loading = useSelector((state: RootState) => state.categories.loading);
  const addCategoryStatus = useSelector(
    (state: RootState) => state.addCategory
  );
  const deleteCategoryStatus = useSelector(
    (state: RootState) => state.deleteCategory
  );

  // Local state
  const [categoryName, setCategoryName] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [editSubcategory, setEditSubcategory] = useState({
    open: false,
    category: "",
    subcategory: "",
  });
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

  // Fetch categories on component mount
  useEffect(() => {
    dispatch(apis.categories());
  }, [dispatch]);

  // Refresh categories list when add/delete operations complete
  useEffect(() => {
    if (addCategoryStatus.success || deleteCategoryStatus.success) {
      dispatch(apis.categories());

      // Reset status
      if (addCategoryStatus.success) {
        dispatch(apis.resetAll());
      }
      // if (deleteCategoryStatus.success) {
      //   dispatch(deleteCategorySlice.actions.resetDeleteCategoryStatus());
      // }
    }
  }, [addCategoryStatus.success, deleteCategoryStatus.success, dispatch]);

  const handleAddCategory = () => {
    if (!categoryName) return;

    const newCategory = {
      name: categoryName,
      parent_id: parentCategory ? Number(parentCategory) : null,
    };

    dispatch(apis.addCategory(newCategory));
    setCategoryName("");
    setParentCategory("");
  };

  const handleEditSubcategory = (category: any, subcategory: any) => {
    setEditSubcategory({ open: true, category, subcategory });
    setNewSubcategoryName(subcategory);
  };
  const organizeCategories = (categories: Category[]) => {
    const mainCategories = categories.filter((cat) => !cat.parent_id);
    const subCategories = categories.filter((cat) => cat.parent_id);

    return mainCategories.map((mainCat) => ({
      ...mainCat,
      subcategories: subCategories.filter(
        (subCat) => subCat.parent_id === mainCat.id
      ),
    }));
  };
  const handleSaveEdit = () => {
    if (!newSubcategoryName.trim()) return;

    const updatedCategory = {
      parent_id: Number(editSubcategory.category),
      name: newSubcategoryName,
    };

    dispatch(apis.editCategory(updatedCategory));
    setEditSubcategory({ open: false, category: "", subcategory: "" });
  };
  const confirmDeleteCategory = (categoryId: any) => {
    setDeleteDialog({ open: true, id: categoryId });
  };

  const handleDeleteCategory = () => {
    if (deleteDialog.id !== null) {
      dispatch(apis.deleteCategory(deleteDialog.id));
    }
    setDeleteDialog({ open: false, id: null });
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center">
        <Loader size={40} color="#014e7a" />
      </div>
    );
  }

  return (
    <div className="flex gap-10 justify-center pt-10">
      <div>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            alignSelf: "flex-start",
            fontWeight: "medium",
          }}
        >
          Add New Category
        </Typography>
        <TextField
          label="Category Name"
          fullWidth
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          margin="normal"
          error={addCategoryStatus.error !== null}
          helperText={addCategoryStatus.error}
        />
        <TextField
          select
          label="Parent Category (Optional)"
          fullWidth
          value={parentCategory}
          onChange={(e) => setParentCategory(e.target.value)}
          margin="normal"
        >
          <MenuItem value="">None</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </TextField>
        <CustomButton
          onClick={handleAddCategory}
          backgroundColor="#014e7a"
          customWidth={"100%"}
          sx={{ mt: 2 }}
          customHeight={"40px"}
          disabled={addCategoryStatus.loading}
        >
          {addCategoryStatus.loading ? <Loader color="#fff" /> : "Add Category"}
        </CustomButton>
      </div>

      {/* Categories List */}
      <div className={styles.categoryList}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            alignSelf: "flex-start",
            fontWeight: "medium",
          }}
        >
          Categories
        </Typography>
        <div className={styles.categoryBox}>
          {organizeCategories(categories).map((category) => (
            <Paper
              key={category.id}
              variant="outlined"
              sx={{ mb: 2, p: 2, width: "400px" }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  {category.name}
                </Typography>
                <Box>
                  <IconButton
                    onClick={() =>
                      handleEditSubcategory(category.id, category.name)
                    }
                    sx={{
                      color: "#014e7a",
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => confirmDeleteCategory(category.id)}
                    color="error"
                  >
                    {deleteCategoryStatus.loading &&
                    deleteCategoryStatus.categoryId === category.id ? (
                      <Loader size={20} color="red" />
                    ) : (
                      <Delete />
                    )}
                  </IconButton>
                </Box>
              </Box>
              {category.subcategories?.length > 0 && (
                <List>
                  {category.subcategories.map((subCategory) => (
                    <ListItem
                      sx={{
                        p: 0,
                      }}
                      key={subCategory.id}
                    >
                      <ListItemText primary={subCategory.name} sx={{ pl: 2 }} />
                      <IconButton
                        sx={{
                          color: "#014e7a",
                        }}
                        onClick={() =>
                          handleEditSubcategory(
                            subCategory.id,
                            subCategory.name
                          )
                        }
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => confirmDeleteCategory(category.id)}
                        color="error"
                      >
                        {deleteCategoryStatus.loading &&
                        deleteCategoryStatus.categoryId === category.id ? (
                          <Loader size={20} color="red" />
                        ) : (
                          <Delete />
                        )}
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          ))}
        </div>
      </div>
      <Dialog
        open={editSubcategory.open}
        onClose={() =>
          setEditSubcategory({ open: false, category: "", subcategory: "" })
        }
      >
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Category Name"
            value={newSubcategoryName}
            onChange={(e) => setNewSubcategoryName(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setEditSubcategory({ open: false, category: "", subcategory: "" })
            }
          >
            Cancel
          </Button>
          <Button onClick={handleSaveEdit}>Save</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this category?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, id: null })}>
            Cancel
          </Button>
          <Button onClick={handleDeleteCategory} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Categories;
