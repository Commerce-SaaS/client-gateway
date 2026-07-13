export const ORDER_PATTERNS = {
    CREATE: "order.create",
    CREATE_POS: "order.create_pos",
    FIND_ALL: "order.find_all",
    FIND_ONE: "order.find_one",
    UPDATE: "order.update",
    CANCEL: "order.cancel",
    ADD_ITEM: "order.add_item",
    REMOVE_ITEM: "order.remove_item",
    UPDATE_ITEM: "order.update_item",

    // Kitchen item-status transitions
    SEND_TO_KITCHEN: "order.send_to_kitchen",
    MARK_ITEM_PREPARED: "order.mark_item_prepared",

    // Scheduled orders
    AVAILABLE_SLOTS: "order.available_slots",
} as const;