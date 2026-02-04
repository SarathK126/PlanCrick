# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY *.csproj ./
RUN dotnet restore

# Copy everything else and build
COPY . ./
RUN dotnet publish -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app

# Copy published app from build stage
COPY --from=build /app/publish .

# Expose port (Railway will override with PORT env var)
EXPOSE 8080

# Start the application
ENTRYPOINT ["dotnet", "PlanCrick.Backend.dll"]
