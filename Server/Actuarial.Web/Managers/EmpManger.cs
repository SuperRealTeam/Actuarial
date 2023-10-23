using System.Data.OleDb;
using System.Data;
using System.Data.SqlClient;
using System.Text;
using ExcelDataReader;
using Actuarial.Domain.DTO;
using Actuarial.Domain.Emp;
using Microsoft.AspNetCore.Http;
using Actuarial.Infrastructure.Repo.Interfaces;
using System.Globalization;
using NPOI.SS.Util;
using System.Text.RegularExpressions;
using Actuarial.Domain.Identity;
using Microsoft.AspNetCore.Identity;

namespace Actuarial.Web.Managers
{
    public class EmpManger:IEmpManger
    {
        private IConfiguration _configuration;
        private IWebHostEnvironment _environment;
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<User> _userManager;
        public EmpManger(IConfiguration configuration, IWebHostEnvironment environment,IUnitOfWork unitOfWork,UserManager<User> userManager)
        {
            _configuration = configuration;
            _environment = environment;
            _unitOfWork = unitOfWork;
            _userManager = userManager;
        }
       

        public ResultClassModel<DataTable> Documentupload(IFormFile upload)
        {
            if (upload != null && upload.Length > 0)
            {
                Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);
                Stream stream = upload.OpenReadStream();
                IExcelDataReader reader = null;
                if(upload.FileName.EndsWith("xls"))
                {
                    reader=ExcelReaderFactory.CreateBinaryReader(stream);
                }
                else if (upload.FileName.EndsWith("xlsx"))
                {
                    reader=ExcelReaderFactory.CreateOpenXmlReader(stream);
                }
                else
                {
                    return new ResultClassModel<DataTable> { Status = Domain.Enumerable.ActionStatus.Error, Message = "This file format is not supported." };

                }
                DataTable dt=new DataTable();
                DataRow dr ;
                DataTable _dt = new();
                try
                {
                    _dt = reader.AsDataSet().Tables[0];
                    for(int i=0;i<_dt.Columns.Count;i++)
                    {
                        dt.Columns.Add(_dt.Rows[0][i].ToString());
                    }
                    for (int row=1; row < _dt.Rows.Count;row++)
                    {
                        dr = dt.NewRow();
                        for(int col=0;col<_dt.Columns.Count;col++)
                        {
                            dr[col] = _dt.Rows[row][col].ToString();
                        }
                        dt.Rows.Add(dr);
                    }
                    return new ResultClassModel<DataTable> { Status = Domain.Enumerable.ActionStatus.Successfull, Message = "Get Data Succesfully.", Object=dt };

                }
                catch (Exception ex)
                {
                    return new ResultClassModel<DataTable> { Status = Domain.Enumerable.ActionStatus.Error, Message = ex.Message };

                }


            }
           return new ResultClassModel<DataTable>{ Status=Domain.Enumerable.ActionStatus.Error,Message="Cannot Get Data from this file."};
        }

        public void ImportCustomer(DataTable customer,HttpContext httpContext)
        {
            User user = new User();
            if (httpContext.User != null)
            {
                Task.Run(async() => { user = await _userManager.GetUserAsync(httpContext.User); }).Wait();
                 
               
            }
                SimpleDateFormat format1 = new SimpleDateFormat("dddd, MMMM d, yyyy");


            List<Employer> custlist = new List<Employer>();
            custlist = (from DataRow dr in customer.Rows
                        select new Employer()
                        {
                            Name = dr["Name"].ToString() ?? "",
                            Gender = UsingRegex(dr["Gender"].ToString()) == true ? Convert.ToInt32(dr["Gender"]) : 0,
                            Birthday = format1.Parse(dr["DOB"].ToString()),
                            DOH = Convert.ToDateTime(dr["DOH"].ToString()),
                            Department = dr["Department"].ToString() ?? "",
                            BasicSalary= UsingRegex(dr["Basic Sal"].ToString()) == true ? Convert.ToDecimal(dr["Basic Sal"]) : 0,
                            TotalSalary = UsingRegex(dr["Total Sal"].ToString()) == true ? Convert.ToDecimal(dr["Total Sal"]) : 0,
                            Mflg = UsingRegex(dr["Mflg"].ToString()) == true ? Convert.ToInt32(dr["Mflg"]) : 0,
                            Owner = user,
                            OwnerId =  user?.Id,
                        }).ToList();
             
            _unitOfWork.GetRepository<Employer>().AddRangeAsync(custlist).Wait();
            if (user == null)
            {
                _unitOfWork.CommitAsync().Wait();
            }
            else
            {
                _unitOfWork.CommitAsync(user.Id.ToString()).Wait();
            }
            
        }

        public static bool UsingRegex(string stringValue)
        {
            var pattern = @"^-?[0-9]+(?:\.[0-9]+)?$";
            var regex = new Regex(pattern);
            return regex.IsMatch(stringValue);
        }
    }
}
