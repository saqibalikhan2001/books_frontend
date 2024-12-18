/** @format */

import { useEffect, useState } from "react";
// import { useNavigate } from "react-router";
import { Button, Checkbox, Modal, Popconfirm, Popover, Row, Space, Typography } from "antd";
import { useAxios } from "app/Hooks";
import { Buttonx, Icons } from "app/shared";
import { isEqual } from "lodash";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Labels } from "static";
import {
  GetDateString,
  handleResetColsFilter,
  handleSelectColumn,
  handleSubmitFilters,
} from "../../../utils";
import { TooltipX } from "../ToolTip";

const { MdDragIndicator } = Icons;

const InfiniteTableFilters = (props) => {
  const {
    url,
    refetch,
    columns,
    colsHeader,
    moduleName,
    table_slug,
    preferences,
    tableSetting,
    ColumnhideRef,
    setcolsheader,
    ColumnOrderRef,
    handleSetCheck,
    freeze_table_width,
    // column_reset_button,
  } = props;

  // const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { callAxios, toggle, bool } = useAxios();
  const [h_cols_name, setcolname] = useState([]);
  const [reorderCols, setReorderCols] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  //eslint-disable-next-line
  let invisibleColumns = props.preferences.map((val) => {
    if (val.show_status === false) return val.slug;
  });
  invisibleColumns = invisibleColumns.filter((item) => !!item);

  useEffect(() => {
    //eslint-disable-next-line
    const h_cols = props.preferences.map((val) => {
      if (val.show_status === false) return val.slug;
    });
    const data = h_cols?.filter((item) => !!item);
    setcolname(data);
    //eslint-disable-next-line
  }, []);

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const items = Array.from(colsHeader);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    //@ts-ignore
    setcolsheader(items);
    const reorderColsname = items.map((col: any) => col.id);
    //@ts-ignore
    setReorderCols(reorderColsname);
    ColumnOrderRef(reorderColsname);
    if (tableSetting?.change_auto) {
      handleSubmitFilters(
        reorderColsname,
        h_cols_name,
        callAxios,
        ColumnOrderRef,
        refetch,
        preferences,
        table_slug,
        toggle,
        tableSetting
      );
    }
  };

  const handleVisibleChange = (visible) => {
    setOpen(visible);
    const show_status_filter = preferences
      .filter((pref: any) => {
        return pref.slug !== "selection" && pref.slug !== "action" && !pref.locked;
      })
      .map((res: any) => {
        return { show_status: res.show_status, slug: res.slug, sort_order: res.sort_order };
      });
    const current_filter = colsHeader.map((res) => {
      return { show_status: res.isVisible, slug: res.id, sort_order: res.sort_order };
    });
    if (
      !visible &&
      freeze_table_width === 100 &&
      h_cols_name?.length < invisibleColumns.length &&
      !Boolean(isEqual(show_status_filter, current_filter))
    ) {
      setIsModalOpen(true);
    }
  };
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    }
  }, [open]);

  return (
    <>
      {!props.selectedProducts?.length && (
        <Popover
          overlayClassName="item_filter"
          placement="bottomLeft"
          open={open}
          onOpenChange={handleVisibleChange}
          content={
            <div className="product-filters">
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                  {(droppableProvided) => (
                    <div ref={droppableProvided.innerRef}>
                      {colsHeader.map((column: any, index) => {
                        return (
                          <Draggable key={GetDateString()} draggableId={column.id} index={index}>
                            {(draggableProvided) => (
                              <div
                                className="col_name"
                                ref={draggableProvided.innerRef}
                                {...draggableProvided.draggableProps}
                                {...draggableProvided.dragHandleProps}
                              >
                                <div className="__dragDrop">
                                  <div
                                    {...draggableProvided.dragHandleProps}
                                    className={"__dragDrop_iconParent"}
                                    tabIndex="-1"
                                  >
                                    <MdDragIndicator />
                                  </div>
                                  <div className="__drag-righ">
                                    <label>
                                      <Checkbox
                                        className="custom_checkbox"
                                        // type="checkbox"
                                        {...column.getToggleHiddenProps()}
                                        onChange={() => {
                                          handleSelectColumn(
                                            column.id,
                                            h_cols_name,
                                            setcolname,
                                            colsHeader,
                                            setcolsheader,
                                            columns,
                                            ColumnhideRef,
                                            freeze_table_width,

                                            tableSetting,
                                            reorderCols,
                                            callAxios,
                                            ColumnOrderRef,
                                            refetch,
                                            preferences,
                                            table_slug,
                                            toggle
                                          );
                                        }}
                                        // disabled={}
                                        style={{
                                          cursor: column.locked ? "not-allowed" : "pointer",
                                        }}
                                      />{" "}
                                      {column.Header}
                                    </label>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      <>
                        {droppableProvided.placeholder}
                        {!tableSetting?.change_auto && (
                          <div className="button_flexbox">
                            <Popconfirm
                              key="confirm"
                              placement="left"
                              disabled={false}
                              title={
                                <label>
                                  Are you sure you want to reset <strong>{moduleName}</strong> table
                                  settings?
                                </label>
                              }
                              cancelText="No"
                              okText="YES"
                              showCancel
                              onCancel={(e) => e?.stopPropagation()}
                              onConfirm={(e) => {
                                e?.stopPropagation();
                                handleResetColsFilter(
                                  callAxios,
                                  refetch,
                                  handleSetCheck,
                                  toggle,
                                  url
                                );
                              }}
                            >
                              <Button
                                // disabled={column_reset_button || bool}
                                className="btn-default btn-form-size mr-10"
                              >
                                Reset
                              </Button>
                            </Popconfirm>
                            <Buttonx
                              btnText="Apply"
                              disabled={bool}
                              className="btn-primary btn-form-size"
                              clickHandler={() => {
                                setOpen(false);
                                setIsModalOpen(true);
                              }}
                            />
                          </div>
                        )}
                      </>
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          }
          trigger="click"
        >
          <div className="filter-toggle">
            <TooltipX title="Show Columns">
              <img
                src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/showcolumns.svg`}
                alt="show columns"
                className={`hover-effect ${open ? "toggle" : ""}`}
              />
              <span className={`${open ? "color-dark" : "color-gray"}`}>Show Columns</span>
            </TooltipX>
          </div>
        </Popover>
      )}
      <Modal
        centered
        footer={null}
        destroyOnClose
        closable={false}
        open={isModalOpen}
        maskClosable={false}
        width={400}
        className="radius-5 default_modal"
      >
        <Space>
          <Typography.Text>Are you sure you want to save the changes?</Typography.Text>
        </Space>
        <Row justify="center">
          <Space>
            <Button className="btn-form-size btn-default" onClick={() => setIsModalOpen(false)}>
              {Labels.CANCEL}
            </Button>
            <Button
              className="btn-form-size btn-primary"
              onClick={async () => {
                await handleSubmitFilters(
                  reorderCols,
                  h_cols_name,
                  callAxios,
                  ColumnOrderRef,
                  refetch,
                  preferences,
                  table_slug,
                  toggle
                );
                setTimeout(() => setIsModalOpen(false), 200);
              }}
            >
              {Labels.SAVE}
            </Button>
          </Space>
        </Row>
      </Modal>
    </>
  );
};

export default InfiniteTableFilters;
