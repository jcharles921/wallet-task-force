import { useState } from "react";
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
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";

const Categories = () => {
  const [categories, setCategories] = useState([
    {
      name: "Food",
      subcategories: ["Groceries", "Dining Out"],
    },
    {
      name: "Transportation",
      subcategories: ["Gas", "Public Transit"],
    },
    {
      name: "Housing",
      subcategories: ["Rent", "Utilities"],
    },
    {
      name: "Entertainment",
      subcategories: ["Movies", "Concerts"],
    },
  ]);

  const [categoryName, setCategoryName] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [editSubcategory, setEditSubcategory] = useState({
    open: false,
    category: "",
    subcategory: "",
  });
  const [newSubcategoryName, setNewSubcategoryName] = useState("");

  const handleAddCategory = () => {
    if (!categoryName) return;

    if (parentCategory) {
      setCategories((prev) =>
        prev.map((cat) => {
          if (cat.name === parentCategory) {
            return {
              ...cat,
              subcategories: [...cat.subcategories, categoryName],
            };
          }
          return cat;
        })
      );
    } else {
      setCategories((prev) => [
        ...prev,
        { name: categoryName, subcategories: [] },
      ]);
    }

    setCategoryName("");
    setParentCategory("");
  };

  const handleDeleteCategory = (
    categoryNameToDelete: string,
    subcategory: string | null = null
  ) => {
    if (subcategory) {
      setCategories((prev) =>
        prev.map((cat) => {
          if (cat.name === categoryNameToDelete) {
            return {
              ...cat,
              subcategories: cat.subcategories.filter(
                (sub) => sub !== subcategory
              ),
            };
          }
          return cat;
        })
      );
    } else {
      setCategories((prev) =>
        prev.filter((cat) => cat.name !== categoryNameToDelete)
      );
    }
  };

  const handleEditSubcategory = (category: any, subcategory: any) => {
    setEditSubcategory({ open: true, category, subcategory });
    setNewSubcategoryName(subcategory);
  };

  //   const handleSaveSubcategory = () => {
  //     setCategories((prev) =>
  //       prev.map((cat) => {
  //         if (cat.name === editSubcategory.category) {
  //           return {
  //             ...cat,
  //             subcategories: cat.subcategories.map((sub) =>
  //               sub === editSubcategory.subcategory ? newSubcategoryName : sub
  //             ),
  //           };
  //         }
  //         return cat;
  //       })
  //     );
  //     setEditSubcategory({ open: false, category: "", subcategory: "" });
  //     setNewSubcategoryName("");
  //   };

  return (
    <div className="flex gap-10 justify-center  ">
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
            <MenuItem key={category.name} value={category.name}>
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
        >
          Add Category
        </CustomButton>
      </div>

      {/* Categories List */}
      <div className=" w-auto flex flex-col  items-center justify-center pl-8">
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
        <div className=" overflow-y-scroll  grid grid-cols-2 gap-4 max-h-[calc(100vh-160px)]">
          {categories.map((category) => (
            <Paper
              key={category.name}
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
                <IconButton
                  onClick={() => handleDeleteCategory(category.name)}
                  color="primary"
                >
                  <ClearOutlinedIcon />
                </IconButton>
              </Box>
              <List>
                {category.subcategories.map((sub) => (
                  <ListItem
                    key={sub}
                    secondaryAction={
                      <>
                        <IconButton
                          onClick={() =>
                            handleEditSubcategory(category.name, sub)
                          }
                          color="primary"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          onClick={() =>
                            handleDeleteCategory(category.name, sub)
                          }
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </>
                    }
                  >
                    <ListItemText primary={sub} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          ))}
        </div>
      </div>

      {/* Edit Subcategory Dialog */}
      <Dialog
        open={editSubcategory.open}
        onClose={() =>
          setEditSubcategory({ open: false, category: "", subcategory: "" })
        }
      >
        <DialogTitle>Edit Subcategory</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Subcategory Name"
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
          <Button>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Categories;
