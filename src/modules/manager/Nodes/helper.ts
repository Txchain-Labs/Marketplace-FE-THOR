// const columns = useMemo(() => {
//     return [
//       ...(!mdBreakPoint
//         ? [
//             {
//               name: 'id',
//               label: '',
//               options: {
//                 filter: false,
//                 sort: false,
//                 display: true,
//               },
//             },
//           ]
//         : []),
//       {
//         name: 'name',
//         label: 'NAME',
//         options: {
//           filter: false,
//           sort: false,
//           display: true,
//         },
//       },
//       {
//         name: 'status',
//         label: 'STATUS',
//         options: {
//           filter: true,
//           sort: true,
//           display: true,
//         },
//       },
//       {
//         name: 'bestBid',
//         label: 'BEST BID',
//         options: {
//           filter: true,
//           sort: true,
//           display: true,
//         },
//       },
//       ...(activeType === 'ORIGIN'
//         ? [
//             {
//               name: 'perks',
//               label: 'PERKS',
//               options: {
//                 filter: false,
//                 sort: false,
//                 display: true,
//               },
//             },
//             {
//               name: 'date',
//               label: 'DATE',
//               options: {
//                 filter: true,
//                 sort: true,
//                 display: true,
//               },
//             },
//           ]
//         : []),

//       ...(activeType === 'DRIFT'
//         ? [
//             {
//               name: 'condition',
//               label: 'CONDITION',
//               options: {
//                 filter: false,
//                 sort: false,
//                 display: true,
//               },
//             },
//             {
//               name: 'date',
//               label: 'DATE/TIME',
//               options: {
//                 filter: true,
//                 sort: true,
//                 display: true,
//               },
//             },
//           ]
//         : []),
//       {
//         name: 'rewards',
//         label: 'Pending Rewards',
//         options: {
//           filter: false,
//           sort: false,
//           display: true,
//         },
//       },
//       ...(activeType === 'ORIGIN'
//         ? [
//             {
//               name: 'dailyRewards',
//               label: 'Daily Rewards',
//               options: {
//                 filter: false,
//                 sort: false,
//                 display: true,
//               },
//             },
//           ]
//         : []),
//       ...(activeType === 'DRIFT'
//         ? [
//             {
//               name: 'vrr',
//               label: 'VRR',
//               options: {
//                 filter: false,
//                 sort: false,
//                 display: true,
//               },
//             },
//             {
//               name: 'multiplier',
//               label: 'Multiplier',
//               options: {
//                 filter: false,
//                 sort: false,
//                 display: true,
//               },
//             },
//           ]
//         : []),
//       {
//         name: 'dueDate',
//         label: 'DUE DATE',
//         options: {
//           filter: false,
//           sort: false,
//           display: true,
//         },
//       },
//       ...(!mdBreakPoint
//         ? [
//             {
//               name: 'action',
//               label: '',
//               options: {
//                 filter: false,
//                 sort: false,
//                 display: true,
//               },
//             },
//           ]
//         : []),
//     ];
//   }, [mdBreakPoint, activeType]);

export const getColumns = (mdBreakPoint: boolean, activeType: string) => {
  return [
    ...(!mdBreakPoint
      ? [
          {
            name: 'id',
            label: '',
            options: {
              filter: false,
              sort: false,
              display: true,
            },
          },
        ]
      : []),
    {
      name: 'name',
      label: 'NAME',
      options: {
        filter: false,
        sort: false,
        display: true,
      },
    },
    {
      name: 'status',
      label: 'STATUS',
      options: {
        filter: true,
        sort: true,
        display: true,
      },
    },
    {
      name: 'bestBid',
      label: 'BEST BID',
      options: {
        filter: true,
        sort: true,
        display: true,
      },
    },
    ...(activeType === 'ORIGIN'
      ? [
          {
            name: 'perks',
            label: 'PERKS',
            options: {
              filter: false,
              sort: false,
              display: true,
            },
          },
          {
            name: 'date',
            label: 'DATE',
            options: {
              filter: true,
              sort: true,
              display: true,
            },
          },
        ]
      : []),

    ...(activeType === 'DRIFT'
      ? [
          {
            name: 'condition',
            label: 'CONDITION',
            options: {
              filter: false,
              sort: false,
              display: true,
            },
          },
          {
            name: 'date',
            label: 'DATE/TIME',
            options: {
              filter: true,
              sort: true,
              display: true,
            },
          },
        ]
      : []),
    {
      name: 'rewards',
      label: 'Pending Rewards',
      options: {
        filter: false,
        sort: false,
        display: true,
      },
    },
    ...(activeType === 'ORIGIN'
      ? [
          {
            name: 'dailyRewards',
            label: 'Daily Rewards',
            options: {
              filter: false,
              sort: false,
              display: true,
            },
          },
        ]
      : []),
    ...(activeType === 'DRIFT'
      ? [
          {
            name: 'vrr',
            label: 'VRR',
            options: {
              filter: false,
              sort: false,
              display: true,
            },
          },
          {
            name: 'multiplier',
            label: 'Multiplier',
            options: {
              filter: false,
              sort: false,
              display: true,
            },
          },
        ]
      : []),
    {
      name: 'dueDate',
      label: 'DUE DATE',
      options: {
        filter: false,
        sort: false,
        display: true,
      },
    },
    ...(!mdBreakPoint
      ? [
          {
            name: 'action',
            label: '',
            options: {
              filter: false,
              sort: false,
              display: true,
            },
          },
        ]
      : []),
  ];
};
