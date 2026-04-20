import { Tooltip } from "antd";
import moment from "moment";
import { IPercentageData } from "src/components/InstallmentPayment/InstallmentPayment.model";
import { ToWords } from "to-words";
import { Buffer } from "buffer";
import { CertificateGrades, Common, RoleType, UserStatus } from "./constants/constant";
import { IUser, IUserData, IUserRole } from "src/services/user/user.model";
import { IBranch, IBranchDetails } from "src/services/branch/branch.model";
import { ability } from "src/ability";

export const facultyDataByBranchId = (
  branchId: number[],
  usersData: IUser,
  branchesData: IBranch,
  zone?: number[]
) => {
  const zoneData =
    branchId &&
    branchesData.rows
      .filter((branch: IBranchDetails) => branchId.includes(branch.id))
      .map((branch: IBranchDetails) => branch?.zone?.id);
  const facultyDataByBranch: IUserData[] = [];
  usersData?.rows.filter((user: IUserData) => {
    const role =
      zoneData !== undefined && user?.user_roles
        ? user?.user_roles.filter(
            (role: IUserRole) =>
              (zone && zone.length > 0 ? zone : zoneData).includes(
                role.zone.id
              ) && role.role.type === RoleType.FACULTY
          )
        : [];
    if (role.length > 0) {
      facultyDataByBranch.push(user);
    }
  });
  const filteredUsers = filterUsers(facultyDataByBranch);
  return filteredUsers;
};

export const userBranchWiseStatusCheck = (
  zoneId: number | number[],
  facultyData: IUserData[],
  roleType: RoleType
): IUserData[] => {
  const zoneIds = Array.isArray(zoneId) ? zoneId : [zoneId];

  return facultyData.map((faculty) => {
    const { status, user_roles } = faculty;

    if (status === UserStatus.DISABLE) {
      return faculty;
    }

   const hasValidRole = user_roles?.some(
  ({ role, zone, status: roleStatus }) =>
    role.type === roleType && zone && zoneIds.includes(zone.id) && roleStatus
);
    return {
      ...faculty,
      status: hasValidRole ? status : UserStatus.DISABLE,
    };
  });
};

function filterUsers(users: IUserData[]) {
  if (
    ability.can(
      Common.Actions.CAN_VIEW,
      Common.Modules.USER_CONFIGURATION.DISABLE_USER
    )
  ) {
    // If permission is given, return all users (both ENABLE and DISABLE)
    return users;
  } else {
    // If permission is not given, filter and return only ENABLE users
    return users.filter((user) => user.status === UserStatus.ENABLE);
  }
}

export const generateTimeArray = (startHour: number, endHour: number) => {
  const timeArray = [];

  for (let hour = startHour; hour <= endHour; hour++) {
    const formattedHour = hour % 12 || 12;
    const amPm = hour < 12 ? "AM" : "PM";
    timeArray.push([`${hour.toString()}.00`, `${formattedHour}:00 ${amPm}`]);
    if (hour !== endHour) {
      timeArray.push([`${hour.toString()}.30`, `${formattedHour}:30 ${amPm}`]);
    }
  }

  return timeArray;
};

export const generateTimeForTenMinGapArray = (
  startHour: number,
  endHour: number
) => {
  const timeArray: Array<[string, string]> = [];
  const increments = [0, 10, 20, 30, 40, 50]; // 10-minute intervals

  for (let hour = startHour; hour <= endHour; hour++) {
    const formattedHour = hour % 12 || 12;
    const amPm = hour < 12 ? "AM" : "PM";

    increments.forEach((minutes) => {
      if (hour === endHour && minutes !== 0) {
        return;
      }

      const formattedMinutes = minutes.toString().padStart(2, "0");
      timeArray.push([
        `${hour.toString()}.${formattedMinutes}`,
        `${formattedHour}:${formattedMinutes} ${amPm}`,
      ]);
    });
  }

  return timeArray;
};

export const getFacultyByZone = (
  usersData: IUser,
  currentZoneId: number,
  addUserID?: number[]
) => {
  const userRoles: {}[] = [];
  usersData.rows.map((d) => {
    const data = d.user_roles?.filter(
      (r) => r.zone.id == currentZoneId && r.role.type == RoleType.FACULTY
    );
    if ((data && data?.length > 0) || addUserID?.includes(d.id))
      userRoles.push({
        id: d?.id,
        first_name: d?.first_name,
        last_name: d?.last_name,
      });
  });
  return userRoles;
};
export const dateFormate = (date: string | Date) => {
  if (date) {
    return moment(date).format("DD-MMM-YYYY");
  }
  return date;
};

export const dateFormateWithTime = (date: string | Date) => {
  if (date) {
    return moment(date).format("DD-MMM-YYYY, h:mm A");
  }
  return date;
};

export const formatDateTime = (date: string) => {
  if (!date) return "-";
  const dateFormat = new Date(date);
  const formattedDate = dateFormate(dateFormat);
  return (
    <div className="date-time-wrapper">
      {formattedDate}
    </div>
  );
};

export const timeFormate = (date: string | Date) => {
  if (date) {
    return moment(date).format("h:mm A");
  }
  return date;
};

export const trimObject = (data: any) => {
  var trimmed = JSON.stringify(data, (key, value) => {
    if (typeof value === "string") {
      return value.trim();
    }
    return value;
  });
  return JSON.parse(trimmed);
};

export const isCSV = (name: string) => {
  const reg = /^.*\.(csv|CSV)$/;
  return reg.test(name);
};

export const currencyFormat = (amount: number | string) => {
  if (amount) {
    return Number(amount || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });
  } else {
    return Number(amount || 0);
  }
};

export const calculateGst = (netAmount: number | string) => {
  let gst;
  if (netAmount) {
    gst = (Number(netAmount) * 18) / 118;
    gst /= 2;
  }
  return Math.trunc(Number(gst));
};

export const GetSortOrder = (prop: any, order: "ASC" | "DESC") => {
  return function (a: any, b: any) {
    if (order === "ASC") {
      if (a[prop]?.toLowerCase() > b[prop]?.toLowerCase()) {
        return 1;
      } else if (a[prop]?.toLowerCase() < b[prop]?.toLowerCase()) {
        return -1;
      }
    } else if (order === "DESC") {
      if (a[prop] > b[prop]) {
        return -1;
      } else if (a[prop] < b[prop]) {
        return 1;
      }
    }
    return 0;
  };
};
export const GetSortOrderWithoutLowercase = (
  prop: any,
  order: "ASC" | "DESC"
) => {
  return function (a: any, b: any) {
    if (order === "ASC") {
      if (a[prop] > b[prop]) {
        return 1;
      } else if (a[prop] < b[prop]) {
        return -1;
      }
    } else if (order === "DESC") {
      if (a[prop] > b[prop]) {
        return -1;
      } else if (a[prop] < b[prop]) {
        return 1;
      }
    }
    return 0;
  };
};

export const showTooltip = (value: string, maxLength: number) => {
  if (value && value.length > maxLength) {
    const truncatedValue = value.substring(0, maxLength) + "...";
    const tooltipValue = value.substring(0);
    return (
      <Tooltip title={tooltipValue}>
        <span>{truncatedValue}</span>
      </Tooltip>
    );
  }
  return <span>{value}</span>;
};

export const CommonData = (arrList: number[][]) => {
  const arrLength = Object.keys(arrList).length;
  const index: Record<string, Record<string, boolean>> = {};
  for (const i in arrList) {
    for (const j in arrList[i]) {
      const v = arrList[i][j];
      if (index[v] === undefined) index[v] = {};
      index[v][i] = true;
    }
  }
  const retv: string[] = [];
  for (const i in index) {
    if (Object.keys(index[i]).length === arrLength) retv.push(i);
  }
  return retv;
};

export const toWords = new ToWords({
  localeCode: "en-IN",
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
    currencyOptions: {
      // can be used to override defaults for the selected locale
      name: "Rupee",
      plural: "Rupees",
      symbol: "₹",
      fractionalUnit: {
        name: "Paisa",
        plural: "Paise",
        symbol: "",
      },
    },
  },
});

export const openInNewTab = (url: string) => {
  window.open(url, "_blank");
};

export const calculateSGst = (netAmount: any) => {
  let sgst;
  if (netAmount) {
    sgst = (Number(netAmount) * 18) / 118;
    sgst /= 2;
  }
  return Math.round(Number(sgst));
};
export const calculateSGstComposition = (netAmount: any) => {
  let sgst;
  if (netAmount) {
    sgst = (Number(netAmount) * 6) / 106;
    sgst /= 2;
  }
  return Math.round(Number(sgst));
};

export const getPercentage = (
  data: IPercentageData[],
  advancePayAmount: number
) => {
  const maxPer: (number | undefined)[] = data
    .map((x: IPercentageData) => {
      if (advancePayAmount >= Number(x.amount)) {
        return x.percentage;
      }
    })
    .filter((x) => x);
  return Math.max(...(maxPer as number[]));
};

type Gender = "MALE" | "FEMALE" | "OTHER";

export const getFinalGendar = (value: string): Gender => {
  if (value === "M") {
    return "MALE";
  } else if (value === "F") {
    return "FEMALE";
  } else {
    return "OTHER";
  }
};

export const bufferURLEncode = (url: string) => {
  return Buffer.from(url).toString("base64");
};

export const bufferURLDecode = (url: string) => {
  return Buffer.from(url, "base64").toString();
};

export const StringContaingNumberSort =
  (prop: string) =>
  (a: any, b: any): number => {
    const extractNumber = (name: string): number => {
      const match = name.match(/\d+/);
      return match ? parseInt(match[0]) : NaN;
    };

    const numA: number = extractNumber(a[prop]);
    const numB: number = extractNumber(b[prop]);

    // Compare numeric parts
    if (numA < numB) return -1;
    if (numA > numB) return 1;

    // If numeric parts are equal, compare the whole string
    return a[prop].localeCompare(b[prop]);
  };

export const showTooltipForDropDownOption = (description: string) => {
  var divContainer = document.createElement("div");
  divContainer.innerHTML = description;
  const maxLength = 30;
  return (
    <span>
      {showTooltip(
        divContainer.textContent || divContainer.innerText || "",
        maxLength
      )}
    </span>
  );
};

export const convertTo12HourFormat = (time_24: string) => {
  const [hour, minute] = time_24.split(/[:.]/).map(Number);
  if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
    const period = hour < 12 ? "AM" : "PM";
    const hour_12 = hour % 12 || 12;
    return `${hour_12.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")} ${period}`;
  }
};

export const calculateTimeDifference = ({
  start_time,
  end_time,
  splitWith = ".",
}: {
  start_time: string;
  end_time: string;
  splitWith?: string;
}) => {
  const [startHours, startMinutes] = start_time
    .split(splitWith)
    .map(parseFloat);
  const [endHours, endMinutes] = end_time.split(splitWith).map(parseFloat);

  // Calculate the difference in minutes
  const diffMinutes = moment
    .duration({
      hours: endHours - startHours,
      minutes: endMinutes - startMinutes,
    })
    .asMinutes();

  // Convert the difference to hours and minutes
  const hoursDiff = Math.floor(diffMinutes / 60);
  // Using Math.abs() to handle negative differences
  const minutesDiff = Math.abs(diffMinutes % 60);

  return `${hoursDiff}${splitWith}${minutesDiff}`;
};

export const downloadFile = (fileUrl: string) => {
  const filename = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);

  const link = document.createElement("a");
  link.href = fileUrl;
  link.setAttribute("download", filename);
  link.setAttribute("target", "_blank");

  document.body.appendChild(link);
  link.click();

  // Clean up
  document.body.removeChild(link);
};

export const chartCurrencyFormat = (amount: number): string => {
  return amount.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });
};

export const calculateAge = (birthdate: any): number => {
  const birthDate = new Date(birthdate);
  const today = new Date();

  // Calculate the difference in years
  let age = today.getFullYear() - birthDate.getFullYear();

  // Adjust the age if the birthdate has not yet occurred this year
  const monthDifference = today.getMonth() - birthDate.getMonth();
  const dayDifference = today.getDate() - birthDate.getDate();
  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
    age--;
  }

  // Calculate the number of days lived since the last birthday
  const lastBirthday = new Date(
    today.getFullYear(),
    birthDate.getMonth(),
    birthDate.getDate()
  );
  if (lastBirthday > today) {
    lastBirthday.setFullYear(lastBirthday.getFullYear() - 1);
  }
  const daysLived =
    (today.getTime() - lastBirthday.getTime()) / (1000 * 60 * 60 * 24);

  // Calculate the total number of days in the current year
  const isLeapYear = (year: number) =>
    year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const daysInYear = isLeapYear(today.getFullYear()) ? 366 : 365;

  // Calculate the fractional year
  const fractionOfYear = daysLived / daysInYear;

  // Return the age rounded to one decimal place
  return Math.round((age + fractionOfYear) * 10) / 10;
};

export const dateFormateWithDDMMYYYY = (date: string | Date) => {
  if (date) {
    return moment(date).format("DD-MM-YYYY");
  }
  return date;
};

export const dateFormateWithYYYYMM = (date: string | Date) => {
  if (date) {
    return moment(date).format("YYYY-MM");
  }
  return date;
};

export const calculateTimeDifferenceInSeconds = (
  time1: string,
  time2: string
) => {
  if (time1 === "-" || time2 === "-") {
    return null;
  }
  const momentTime1 = moment(time1, "HH:mm:ss");
  const momentTime2 = moment(time2, "HH:mm:ss");

  return Math.abs(momentTime2.diff(momentTime1, "seconds"));
};

export function customRound(value: number) {
  let decimalPart = value - Math.floor(value);
  return decimalPart > 0.51 ? Math.ceil(value) : Math.floor(value);
}

export function convertToCSV(data: any[]) {
  const headers = [
    "Topic Type",
    "Answer Type",
    "Question Type",
    "Severity Type",
    "Question",
    "Marks",
    "Description",
    "Tags",
    "Option-1",
    "Option-2",
    "Option-3",
    "Option-4",
    "Answer",
  ];
  const result = [
    headers.join(","),
    ...data
      .flat()
      .map((question) => headers.map((header) => question[header]).join(",")),
  ].join("\n");
  
  return result;
}

export function convertTopicToCSV(data: any[]) {
  const headers = [
    "SR NO",
    "Topic Type",
    "Topic Sequence",
    "Topic Name",
    "Marks",
    "Duration",
    "Sub Topic Sequence 1",
    "Sub Topic Name 1",
    "Sub Topic Sequence 2",
    "Sub Topic Name 2",
  ];
  const rows = (Array.isArray(data[0]) ? data[0] : data).map((row) =>
    headers.map((res) => `"${(row[res] ?? "").replace(/"/g, '""')}"`).join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}

export function getStudentPerformanceGrade(percentage: number) {
  if (
    percentage === null ||
    percentage === undefined ||
    isNaN(Number(percentage))
  ) {
    return 0;
  }

  const performance = Number(percentage);

  if (performance >= 91) {
    return CertificateGrades.A_PLUS;
  } else if (performance >= 81) {
    return CertificateGrades.A;
  } else if (performance >= 71) {
    return CertificateGrades.B_PLUS;
  } else if (performance >= 61) {
    return CertificateGrades.B;
  } else if (performance >= 51) {
    return CertificateGrades.C;
  } else {
    return CertificateGrades.D;
  }
}
export function canView(subject: string): boolean {
  return ability.can(Common.Actions.CAN_VIEW, subject);
}

export function convertTimeFromNumeric(time: string) {
  const numericTime = Number(time);
  const hours = Math.floor(numericTime);
  const minutes = Math.round((numericTime - hours) * 100);

  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);

  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}