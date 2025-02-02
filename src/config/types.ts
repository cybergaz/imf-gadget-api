const statusEnum = ["Available", "Deployed", "Destroyed", "Decommissioned"] as const;

type Result<T = any> = {
    success: boolean;
    message?: string;
    data?: T;
};

export { statusEnum, Result };
