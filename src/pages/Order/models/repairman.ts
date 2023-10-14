import { getAllUser } from '@/services/api/user';
import { Role } from '@/utils/constants';
import { useEffect, useState } from 'react';

export default () => {
  const [loading, setLoading] = useState(true);
  const [repairmanList, setRepairmanList] = useState<API.User[]>([]);

  useEffect(() => {
    getAllUser({ role: Role.Repairman, relateOrder: true }).then((res) => {
      if (res.code === 200) {
        setLoading(false);
        setRepairmanList(res.data.list ?? []);
      }
    });
  }, []);
  return {
    loading,
    repairmanList,
  };
};
