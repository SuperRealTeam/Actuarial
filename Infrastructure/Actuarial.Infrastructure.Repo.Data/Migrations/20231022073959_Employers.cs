using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Actuarial.Infrastructure.Repo.Data.Migrations
{
    /// <inheritdoc />
    public partial class Employers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "EMPLOYERS",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Gender = table.Column<int>(type: "int", nullable: false),
                    Birthday = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DOH = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Department = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BasicSalary = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TotalSalary = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Mflg = table.Column<int>(type: "int", nullable: false),
                    InternalApplicationName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    InternalCreationDateTimeUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    InternalModificationDateTimeUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    InternalValidation = table.Column<bool>(type: "bit", nullable: false),
                    InternalIsDelete = table.Column<bool>(type: "bit", nullable: false),
                    OwnerId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EMPLOYERS", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EMPLOYERS_AspNetUsers_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_EMPLOYERS_OwnerId",
                table: "EMPLOYERS",
                column: "OwnerId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EMPLOYERS");
        }
    }
}
