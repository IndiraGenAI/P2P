import { UserCheck } from 'lucide-react';
import { MasterListPage } from '@/components/master/MasterListPage';
import { Common } from '@/utils/constants/constant';
import {
  applicantTypeMasterSelector,
  clearApplicantTypeMessage,
  createNewApplicantType,
  editApplicantTypeById,
  removeApplicantTypeById,
  searchApplicantTypeData,
  updateApplicantTypeStatus,
} from '@/state/applicantType/applicantType.reducer';
import ApplicantTypeAdd from './Add';
import type { IApplicantTypeRecord } from './ApplicantType.model';

export const ApplicantTypePage = () => (
  <MasterListPage<IApplicantTypeRecord>
    pageCode={Common.Modules.MASTER.APPLICANT_TYPE}
    singularLabel="Applicant Type"
    pluralLabel="Applicant Types"
    icon={UserCheck}
    selector={applicantTypeMasterSelector}
    clearMessage={clearApplicantTypeMessage}
    searchAction={searchApplicantTypeData}
    createAction={createNewApplicantType}
    editAction={editApplicantTypeById}
    removeAction={removeApplicantTypeById}
    updateStatusAction={updateApplicantTypeStatus}
    AddForm={ApplicantTypeAdd}
    buildRecordFromRow={(row) => ({
      id: row.id,
      code: (row.code as string) ?? '',
      name: row.name,
      status: row.status,
    })}
    buildCreatePayload={(values) => ({
      code: values.code,
      name: values.name,
    })}
    buildEditPayload={(values, id) => ({
      id,
      code: values.code,
      name: values.name,
    })}
  />
);

export default ApplicantTypePage;
