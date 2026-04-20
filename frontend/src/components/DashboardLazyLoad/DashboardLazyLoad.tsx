import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import useInfiniteScroll from "src/hooks/useInfiniteScroll";
import DashboardTable from "../DahboardTable";
import { IDashboardLazyLoad } from "./DashboardLazyLoad.model";
import { AdmissionRecurring } from "src/services/students/student.model";
import { LazyLoadPageCount } from "src/utils/constants/constant";
import { MasterDahsboardFilterContext } from "src/contexts/MasterDashboardFilterContext";

const DashboardLazyLoad = (props: IDashboardLazyLoad) => {
  const {
    dispatchFunction,
    columns,
    loading,
    cardTitle,
    loadCount = LazyLoadPageCount.twenty,
    gr_id,
    ptmStatusType,
    ...otherProps
  } = props;
  const [branchFilter, setBranchFilter] = useState<number[]>([]);
  const [zoneFilter, setZoneFilter] = useState<number[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState<number | undefined>();
  const [selectedBatch, setSelectedBatch] = useState<number | null>();
  const [skipLoad, setSkipLoad] = useState<number>(1);
  const [listData, setListData] = useState<AdmissionRecurring[]>([]);
  const [hasMoreData, setHasMoreData] = useState<boolean>(true);
  const [filterApplied, setFilterApplied] = useState(false);
  const { setLastElementRef } = useInfiniteScroll(setSkipLoad, hasMoreData);
  const [totalCount, setTotalCount] = useState<string>();
  const { masterSelectedZone, masterSelectedBranch, masterSelectedFaculty } =
    useContext(MasterDahsboardFilterContext);

  useEffect(() => {
    setBranchFilter(masterSelectedBranch);
    setZoneFilter(masterSelectedZone);
    setSelectedFaculty(masterSelectedFaculty);
    fetchFunction(true);
  }, [masterSelectedZone, masterSelectedBranch, masterSelectedFaculty, gr_id]);

  useEffect(() => {
    if (hasMoreData && (filterApplied || skipLoad > 1)) {
      fetchFunction();
    }
  }, [skipLoad, filterApplied]);

  const fetchFunction = useCallback(
    async (filter: boolean = false) => {
      if (filter) {
        setSkipLoad(1);
        setListData([]);
        setHasMoreData(true);
        setFilterApplied(true);
      } else {
        const data = await dispatchFunction({
          skip: (skipLoad - 1) * loadCount,
          take: loadCount,
          zoneIds: zoneFilter.length > 0 ? zoneFilter.join(",") : null,
          branchIds: branchFilter.length > 0 ? branchFilter.join(",") : null,
          facultyId: selectedFaculty ? selectedFaculty : null,
          batchId: selectedBatch ? selectedBatch : null,
          status: ptmStatusType,
          gr_id: gr_id ? gr_id : null,
        });
        setTotalCount(data?.meta.itemCount.toString());
        setListData((prevData) => [...prevData, ...(data?.rows ?? [])]);
        setFilterApplied(false);
        setHasMoreData(data?.rows.length === loadCount);
      }
    },
    [filterApplied, skipLoad]
  );

  const ModifiedListData = useMemo(() => {
    return listData.map((record) => ({
      ...record,
      studentName: `${record.admission.first_name} ${
        record.admission.middle_name || ""
      } ${record.admission.last_name}`,
    }));
  }, [listData]);

  return (
    <DashboardTable
      {...otherProps}
      setBranchFilter={(data: number[]) => setBranchFilter(data)}
      setZoneFilter={(data: number[]) => setZoneFilter(data)}
      setSelectedFaculty={(data: number) => setSelectedFaculty(data)}
      selectedBatch={selectedBatch}
      setSelectedBatch={(data) => setSelectedBatch(data)}
      columns={columns}
      loading={loading}
      CardTitle={cardTitle}
      dataSource={ModifiedListData}
      fetchData={fetchFunction}
      dataCount={totalCount}
      lastElementRef={setLastElementRef}
    />
  );
};

export default React.memo(DashboardLazyLoad);
