export interface IFormInitialValue {
    [name: string]: string;
}

export interface IAllSlotDetails {
    id: number
    slots: slotDetails[] 
}
export interface slotDetails {
    batch_id: number
    start_time: string
    end_time: string
    hold_count: number
    occupy_count: number
    total_count?: number
  }