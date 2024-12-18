/**@format */

import { Popconfirm } from "antd";

export const itemActions = (handleBulkActions, categories) => {
  return [
    {
      key: "1",
      label: "Make Active",
      onClick: () => handleBulkActions("active"),
    },
    {
      key: "2",
      label: "Make Inactive",
      onClick: () => handleBulkActions("inactive"),
    },
    {
      key: "3",
      label: (
        <Popconfirm
          key="confirm"
          placement="left"
          title={`Are you sure you want to delete selected products?`}
          okText={"Yes"}
          cancelText="No"
          showCancel
          onCancel={(e) => e?.stopPropagation()}
          onConfirm={(e) => {
            e?.stopPropagation();
            handleBulkActions("delete");
          }}
        >
          {/* <TooltipX title="Delete"> */}
            <label
              style={{ display: "block", width: "100%" }}
              onClick={(e) => e?.stopPropagation()}
            >
              Delete
            </label>
          {/* </TooltipX> */}
        </Popconfirm>
      ),
    },
    {
      key: "4",
      label: "Assign Category",
      popupClassName: "overflow-y-auto",
      children: categories.map((category) => ({
        ...category,
        key: `4-${category?.id}`,
        onClick: () => handleBulkActions("category_assign", category?.id),
      })),
    },
  ];
};

// export const SortContent = ({ pagination, setparam, handleSortPopOver }) => {
//   const [form] = Form.useForm();
//   const sort = Form.useWatch("sort", form);
//   const sort_column = Form.useWatch("sort_column", form);
//   const [radioOption, setRadioOption] = useState<string>("asc");

//   const onChange = (e) => {
//     setRadioOption(e.target.value);
//   };

//   return (
//     <div className="_generic_popupover_main">
//       <Form
//         className="inner_spacing"
//         form={form}
//         initialValues={{
//           sort: pagination.sort || "asc",
//           sort_column: pagination.sort_column || "name",
//         }}
//         onFinish={(values) => {
//           setparam({
//             ...pagination,
//             sort: values.sort,
//             sort_column: values?.sort_column,
//           });
//           handleSortPopOver(false);
//         }}
//         style={{ maxWidth: 600, minWidth: 250 }}
//       >
//         <div className="form_group  mb-20">
//           <Selectx
//             allowClear={false}
//             label={""}
//             size="middle"
//             name="sort_column"
//             className="adjustment-field status-input"
//             placeholder="Sort by column"
//             popupClassName="overlap py-10"
//             options={filterSort}
//           />
//         </div>
//         <div className="form_group  mb-20">
//           <label>Sort order</label>
//           <Form.Item name="sort">
//             <Radio.Group value={radioOption} onChange={onChange} className="important-block">
//               <Radio value="asc" className="block">
//                 Ascending
//               </Radio>
//               <Radio value="desc" className="block">
//                 Descending
//               </Radio>
//             </Radio.Group>
//           </Form.Item>
//         </div>
//         <div className="d-flex  pb-8 justify-center">
//           <Buttonx
//             className="btn-primary w-96px h-36px"
//             btnText="Apply"
//             disabled={pagination.sort === sort && pagination.sort_column === sort_column}
//           />
//         </div>
//       </Form>
//     </div>
//   );
// };
