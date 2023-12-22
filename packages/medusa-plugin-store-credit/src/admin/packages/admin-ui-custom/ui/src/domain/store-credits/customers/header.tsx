import { useNavigate } from "react-router-dom"
import TableViewHeader from "../../../../../../admin-ui/ui/src/components/organisms/custom-table-header"

type P = {
  activeView: "customers" | "groups"
}

/*
 * Shared header component for "customers" and "customer groups" page
 */
function CustomersPageTableHeader(props: P) {
  const navigate = useNavigate()
  return (
    <TableViewHeader
      setActiveView={(v) => {
        if (v === "customers") {
          navigate(`/a/customers`)
        } else {
          navigate(`/a/customers/groups`)
        }
      }}
      views={["customers", "groups"]}
      activeView={props.activeView}
    />
  )
}

export default CustomersPageTableHeader
