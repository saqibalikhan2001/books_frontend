import { Modal } from "antd";
import { ShareOrganization } from "app/containers/Organization/ShareOrganization";
import { Modules } from "app/containers/Settings";

export function ModulePermissionModal({
  item,
  selected,
  innerDrawer,
  setSelected,
  toggleInnerDrawer,
}: any) {
  return (
    <Modal
      width={1600}
      footer={null}
      destroyOnClose
      open={innerDrawer}
      maskClosable={false}
      closable={Boolean(item?.id)}
      onCancel={toggleInnerDrawer}
      style={{
        zIndex: 1500,
        paddingLeft: "6%",
      }}
    >
      {Boolean(item?.id) ? (
        <ShareOrganization organization={item} toggleInnerDrawer={toggleInnerDrawer} />
      ) : (
        !Boolean(item?.id) && (
          <Modules
            isModal
            selected={selected}
            setSelected={setSelected}
            innerDrawer={innerDrawer}
            toggleInnerDrawer={toggleInnerDrawer}
          />
        )
      )}
    </Modal>
  );
}
