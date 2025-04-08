import { useEffect, useState } from "react";
import EntryDenied from "../area-manager/pages/config-service/EntryDen"; // Đảm bảo đường dẫn chính xác

const withPermission = (Component, requiredPermissionId) => {
  const WrappedComponent = (props) => {
    const [isPermissionDenied, setPermissionDenied] = useState(false);
    const permissions = JSON.parse(localStorage.getItem("permissions")) || [];

    console.log("Permissions from localStorage:", permissions);
    console.log("Required Permission ID:", requiredPermissionId);

    useEffect(() => {
      const permission = permissions.find(
        (perm) => perm.IdPermissions === requiredPermissionId
      );

      console.log("Matching permission:", permission);

      const hasPermission = permission && permission.Active;

      console.log("Has required permission:", hasPermission);

      if (!hasPermission) {
        console.log("Permission denied for required ID:", requiredPermissionId);
        setPermissionDenied(true);
      } else {
        console.log("Permission granted for required ID:", requiredPermissionId);
        setPermissionDenied(false);
      }
    }, [permissions, requiredPermissionId]);

    if (isPermissionDenied) {
      console.log("Rendering EntryDenied component for required ID:", requiredPermissionId);
      return <EntryDenied isVisible={isPermissionDenied} onClose={() => setPermissionDenied(false)} />;
    }

    return <Component {...props} />;
  };

  WrappedComponent.displayName = `withPermission(${Component.displayName || Component.name || "Component"})`;

  return WrappedComponent;
};

export default withPermission;
